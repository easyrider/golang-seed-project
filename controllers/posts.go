package controllers

import (
	"fmt"
	"github.com/dancannon/gonews/app"
	"github.com/dancannon/gonews/models"
	repo "github.com/dancannon/gonews/repositories"
	"github.com/dancannon/gonews/util/template"
	"github.com/davecgh/go-spew/spew"
	"github.com/gorilla/mux"
	"math/rand"
	"net/http"
	"strconv"
	"time"
)

type PostController struct {
}

func (c *PostController) Init(r *mux.Router) {
	r.HandleFunc("/", c.TopPostListHandler).Name("homepage")
	r.HandleFunc("/top", c.TopPostListHandler).Name("top_posts")
	r.HandleFunc("/new", c.NewPostListHandler).Name("new_posts")
	r.HandleFunc("/view/{id}", c.PostViewHandler).Name("view_post")
	r.HandleFunc("/submit", c.NewPostHandler).Name("submit_post")
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
	w.Header().Add("Content-Type", "text/html")

	repo.Posts.DeleteAll()
	for i := 0; i < 100; i++ {
		createdAt := int64(rand.Intn(1378469294-1375790900) + 1375790900)

		post := models.Post{
			Author:   "User 1",
			Type:     models.PostTypeLink,
			Title:    "Test Post " + strconv.Itoa(i),
			Meta:     map[string]string{},
			Likes:    rand.Intn(1000),
			Dislikes: rand.Intn(1000),
			Tags:     []string{"News"},
			Created:  time.Unix(createdAt, 0),
			Modified: time.Unix(createdAt, 0),
		}
		post, _ = repo.Posts.Store(post)
		spew.Fdump(w, post)
	}
}
