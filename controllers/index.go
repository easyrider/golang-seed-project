package controllers

import (
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
)

type IndexController struct {
	*mux.Router
}

func (c *IndexController) Init(r *mux.Router) {
	r.HandleFunc("/", c.indexHandler)
}

func (c *IndexController) indexHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "text/html")
	fmt.Fprint(w, "Hello World.")
}
