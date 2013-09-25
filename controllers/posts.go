package controllers

import (
	"code.google.com/p/go.crypto/bcrypt"
	"fmt"
	"github.com/dancannon/gonews/app"
	"github.com/dancannon/gonews/lib/template"
	"github.com/dancannon/gonews/lib/validation"
	"github.com/dancannon/gonews/models"
	repo "github.com/dancannon/gonews/repositories"
	"github.com/davecgh/go-spew/spew"
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
	r.HandleFunc("/view/{id}", c.PostViewHandler).Name("posts_view")
	r.HandleFunc("/submit", c.NewPostHandler).Name("posts_submit")
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
		posts, err = repo.Posts.FindTopByPage(1, 25)
	} else {
		posts, err = repo.Posts.FindNewByPage(1, 25)
	}

	if err != nil {
		fmt.Println(err)
		http.Error(w, "Error fetching posts", http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", "text/html")
	err = template.Render(w, "postlist", &map[string]interface{}{
		"posts":  posts,
		"router": app.Router,
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
	if err != nil {
		fmt.Println(err)
		http.NotFound(w, r)
		return
	}

	w.Header().Add("Content-Type", "text/html")
	fmt.Fprintln(w, post)

}

func (c *PostController) NewPostHandler(w http.ResponseWriter, r *http.Request) {
	// Ensure the user is logged in
	var user models.User

	// Get token from session if it exists
	session, _ := app.Sessions.Get(r, "security")
	if token, ok := session.Values["token"].(authToken); !ok {
		http.Error(w, "Token invalid", http.StatusForbidden)
		return
	} else {
		var err error

		// Ensure the username exists
		user, err = repo.Users.FindByUsername(token.Username)

		if err != nil {
			http.Error(w, "Permission Denied: Token invalid", http.StatusForbidden)
			return
		}

		// Check the password
		if bcrypt.CompareHashAndPassword([]byte(user.Hash), []byte(token.Password)) != nil {
			http.Error(w, "Permission Denied: Token invalid", http.StatusForbidden)
			return
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
			v.AddRule("url", validation.NotBlank{})
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
			post.Author = user.Id
			post.Created = time.Now()
			post.Modified = time.Now()

			post, err = repo.Posts.Store(post)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			spew.Dump(post)

			url, _ := app.Router.Get("posts_view").URL("id", post.Id)
			http.Redirect(w, r, url.String(), http.StatusTemporaryRedirect)
		}
	}

	err = template.Render(w, "posts_submit", &map[string]interface{}{
		"errors": v.Errors(),
		"router": app.Router,
	})

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
