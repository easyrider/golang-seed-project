package controllers

import (
	"code.google.com/p/go.crypto/bcrypt"
	"fmt"
	"github.com/dancannon/gonews/app"
	"github.com/dancannon/gonews/lib/template"
	"github.com/dancannon/gonews/lib/validation"
	"github.com/dancannon/gonews/models"
	repo "github.com/dancannon/gonews/repositories"
	views "github.com/dancannon/gonews/views/posts"
	"github.com/gorilla/mux"
	"github.com/gorilla/schema"
	"net/http"
	"time"
)

type PostController struct {
}

func (c *PostController) Init(r *mux.Router) {
	r.HandleFunc("/", c.TopPostListHandler).Name("homepage")
	r.HandleFunc("/top", c.TopPostListHandler).Name("posts_list_top")
	r.HandleFunc("/new", c.NewPostListHandler).Name("posts_list_new")
	r.HandleFunc("/posts/{id}", c.PostViewHandler).Name("posts_view")
	r.HandleFunc("/posts/{id}/vote/{type}", c.PostVoteHandler).Name("posts_vote")
	r.HandleFunc("/submit", c.NewPostHandler).Name("posts_submit")
	r.HandleFunc("/submit/comment", c.NewCommentHandler).Name("posts_submit_comment")
}

func (c *PostController) TopPostListHandler(w http.ResponseWriter, r *http.Request) {
	c.PostListHandler(w, r, "top")
}

func (c *PostController) NewPostListHandler(w http.ResponseWriter, r *http.Request) {
	c.PostListHandler(w, r, "new")
}

func (c *PostController) PostListHandler(w http.ResponseWriter, r *http.Request, sortMethod string) {
	var (
		err   error
		posts []models.Post
	)

	if sortMethod == "new" {
		posts, err = repo.Posts.FindNewByPage(1, 25)
	} else {
		posts, err = repo.Posts.FindTopByPage(1, 25)
	}

	if err != nil {
		fmt.Println(err)
		http.Error(w, "Error fetching posts", http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", "text/html")
	err = template.Render(w, "postlist", views.List{
		Posts:  posts,
		Router: app.Router,
	})

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (c *PostController) PostViewHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	post, err := repo.Posts.FindById(id)
	if post.Id == "" || err != nil {
		http.NotFound(w, r)
		return
	}

	err = template.Render(w, "posts_view", &views.View{
		Post:     post,
		Comments: LoadThread(post.Id),
		Router:   app.Router,
	})

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (c *PostController) PostVoteHandler(w http.ResponseWriter, r *http.Request) {
	// Ensure the user is logged in
	var user models.User

	// Get token from session if it exists
	session, _ := app.Sessions.Get(r, "security")
	if token, ok := session.Values["token"].(authToken); !ok {
		url, _ := app.Router.Get("security_login").URL()
		http.Redirect(w, r, url.String(), http.StatusTemporaryRedirect)
	} else {
		var err error

		// Ensure the username exists
		user, err = repo.Users.FindByUsername(token.Username)

		if err != nil {
			url, _ := app.Router.Get("security_login").URL()
			http.Redirect(w, r, url.String(), http.StatusTemporaryRedirect)
		}

		// Check the password
		if bcrypt.CompareHashAndPassword([]byte(user.Hash), []byte(token.Password)) != nil {
			url, _ := app.Router.Get("security_login").URL()
			http.Redirect(w, r, url.String(), http.StatusTemporaryRedirect)
		}
	}

	vars := mux.Vars(r)
	id := vars["id"]
	voteType := vars["type"]

	if !(voteType == "like" || voteType == "dislike") {
		http.NotFound(w, r)
		return
	}

	post, err := repo.Posts.FindById(id)
	if post.Id == "" || err != nil {
		http.NotFound(w, r)
		return
	}

	// Get a previous vote if one exists
	vote, err := repo.Votes.FindByPostAndUser(id, user.Id)

	// If the user has voted already on this post then change the type
	if err == nil {
		if voteType == models.VoteTypeLike {
			if vote.Type == models.VoteTypeDislike {
				post.Likes += 1
				post.Dislikes -= 1
			} else {
				post.Likes -= 1
				repo.Votes.Delete(vote.Id)
				repo.Posts.Update(post)

				url, _ := app.Router.Get("posts_view").URL("id", post.Id)
				http.Redirect(w, r, url.String(), http.StatusTemporaryRedirect)
				return
			}
		} else {
			if vote.Type == models.VoteTypeLike {
				post.Likes -= 1
				post.Dislikes += 1
			} else {
				post.Dislikes -= 1
				repo.Votes.Delete(vote.Id)
				repo.Posts.Update(post)

				url, _ := app.Router.Get("posts_view").URL("id", post.Id)
				http.Redirect(w, r, url.String(), http.StatusTemporaryRedirect)
				return
			}
		}
		if post.Likes < 0 {
			post.Likes = 0
		}
		if post.Dislikes < 0 {
			post.Dislikes = 0
		}

		vote.Type = voteType
		repo.Votes.Update(vote)
		repo.Posts.Update(post)
	} else {
		// Otherwise create a new vote
		vote = models.Vote{
			Post: id,
			User: user.Id,
			Type: voteType,
		}
		if voteType == models.VoteTypeLike {
			post.Likes += 1
		} else {
			post.Dislikes += 1
		}

		repo.Votes.Store(vote)
		repo.Posts.Update(post)
	}

	url, _ := app.Router.Get("posts_view").URL("id", post.Id)
	http.Redirect(w, r, url.String(), http.StatusTemporaryRedirect)
}

func (c *PostController) NewPostHandler(w http.ResponseWriter, r *http.Request) {
	// Ensure the user is logged in
	var user models.User

	// Get token from session if it exists
	session, _ := app.Sessions.Get(r, "security")
	if token, ok := session.Values["token"].(authToken); !ok {
		url, _ := app.Router.Get("security_login").URL()
		http.Redirect(w, r, url.String(), http.StatusTemporaryRedirect)
	} else {
		var err error

		// Ensure the username exists
		user, err = repo.Users.FindByUsername(token.Username)

		if err != nil {
			url, _ := app.Router.Get("security_login").URL()
			http.Redirect(w, r, url.String(), http.StatusTemporaryRedirect)
		}

		// Check the password
		if bcrypt.CompareHashAndPassword([]byte(user.Hash), []byte(token.Password)) != nil {
			url, _ := app.Router.Get("security_login").URL()
			http.Redirect(w, r, url.String(), http.StatusTemporaryRedirect)
		}
	}

	// Setup the form data and validator
	err := r.ParseForm()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	v := validation.NewValidator(r.PostForm)

	if r.Method == "POST" {
		// Validate the input
		v.AddRule("title", validation.NotBlank{})
		v.AddRule("tags", validation.Length{Min: 0, Max: 10})

		if r.PostFormValue("type") == "link" {
			v.AddRule("content", validation.NotBlank{})
		} else if r.PostFormValue("type") == "text" {
			v.AddRule("content", validation.NotBlank{})
		} else {
			v.AddError("You have entered an invalid post type")
		}

		if v.Validate() {
			var post models.Post

			decoder := schema.NewDecoder()
			err := decoder.Decode(&post, r.PostForm)

			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			// Add extra post info
			post.AuthorId = user.Id
			post.AuthorName = user.Username
			post.Created = time.Now()
			post.Modified = time.Now()

			post, err = repo.Posts.Store(post)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			url, _ := app.Router.Get("posts_view").URL("id", post.Id)
			http.Redirect(w, r, url.String(), http.StatusTemporaryRedirect)
		}
	}

	err = template.Render(w, "posts_submit", views.Submit{
		Errors: v.Errors(),
		Router: app.Router,
	})

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (c *PostController) NewCommentHandler(w http.ResponseWriter, r *http.Request) {
	// Ensure the user is logged in
	var user models.User

	// Get token from session if it exists
	session, _ := app.Sessions.Get(r, "security")
	if token, ok := session.Values["token"].(authToken); !ok {
		url, _ := app.Router.Get("security_login").URL()
		http.Redirect(w, r, url.String(), http.StatusTemporaryRedirect)
	} else {
		var err error

		// Ensure the username exists
		user, err = repo.Users.FindByUsername(token.Username)

		if err != nil {
			url, _ := app.Router.Get("security_login").URL()
			http.Redirect(w, r, url.String(), http.StatusTemporaryRedirect)
		}

		// Check the password
		if bcrypt.CompareHashAndPassword([]byte(user.Hash), []byte(token.Password)) != nil {
			url, _ := app.Router.Get("security_login").URL()
			http.Redirect(w, r, url.String(), http.StatusTemporaryRedirect)
		}
	}

	// Setup the form data and validator
	err := r.ParseForm()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	v := validation.NewValidator(r.PostForm)

	if r.Method == "POST" {
		// Validate the input
		v.AddRule("content", validation.NotBlank{})

		// If the comment has a parent check it exists
		depth := 0
		if r.PostFormValue("parent") != "" {
			parent, err := repo.Comments.FindById(r.PostFormValue("parent"))
			if err != nil {
				v.AddError("That parent comment does not exist")
			} else {
				depth = parent.Depth + 1
			}
		}

		if v.Validate() {
			var comment models.Comment

			decoder := schema.NewDecoder()
			err := decoder.Decode(&comment, r.PostForm)

			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			// Add extra info
			comment.Post = r.PostFormValue("post")
			comment.Parent = r.PostFormValue("parent")
			comment.Depth = depth
			comment.AuthorId = user.Id
			comment.AuthorName = user.Username
			comment.Created = time.Now()
			comment.Modified = time.Now()

			comment, err = repo.Comments.Store(comment)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			url, _ := app.Router.Get("posts_view").URL("id", comment.Post)
			http.Redirect(w, r, url.String(), http.StatusTemporaryRedirect)
		}
	}

	err = template.Render(w, "posts_submit_comment", views.Submit{
		Errors: v.Errors(),
		Router: app.Router,
	})

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func LoadThread(postId string) []views.Comment {
	var comments []views.Comment

	cs, err := repo.Comments.FindByPost(postId)
	if err != nil {
		return comments
	}

	for _, c := range cs {
		comments = append(comments, views.Comment{
			Comment:  c,
			Children: LoadSubThread(c.Id),
		})
	}

	return comments
}

func LoadSubThread(commentId string) []views.Comment {
	var comments []views.Comment

	cs, err := repo.Comments.FindChildren(commentId)
	if err != nil {
		return comments
	}

	for _, c := range cs {
		comments = append(comments, views.Comment{
			Comment:  c,
			Children: LoadSubThread(c.Id),
		})
	}

	return comments
}
