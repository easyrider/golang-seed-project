package controllers

import (
	"github.com/sagittaros/gonews/app"
	"net/http"
)

// If permission was denied then redirect to the login page
func Error403Handler(w http.ResponseWriter, r *http.Request) {
	url, _ := app.Router.Get("security_login").URL()
	http.Redirect(w, r, url.String(), http.StatusTemporaryRedirect)
}
