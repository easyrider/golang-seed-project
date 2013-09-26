ackage security

import (
    "github.com/gorilla/mux"
)

type Register struct {
    Errors []string
    Router *mux.Router
}
