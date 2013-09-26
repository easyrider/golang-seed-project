package security

import (
	"github.com/gorilla/mux"
)

type Login struct {
	Errors []string
	Router *mux.Router
}
