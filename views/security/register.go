package security

import (
	"github.com/sagittaros/gonews/models"
	"github.com/gorilla/mux"
)

type Register struct {
	User   models.User
	Errors []string
	Router *mux.Router
}
