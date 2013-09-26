package posts

import (
	"github.com/gorilla/mux"
)

type Submit struct {
	Errors []string
	Router *mux.Router
}
