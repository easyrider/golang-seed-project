package controllers

import (
	"code.google.com/p/go.crypto/bcrypt"
	"encoding/gob"
	"fmt"
	"github.com/dancannon/gonews/app"
	"github.com/dancannon/gonews/lib/template"
	"github.com/dancannon/gonews/lib/validation"
	"github.com/dancannon/gonews/models"
	repo "github.com/dancannon/gonews/repositories"
	"github.com/gorilla/mux"
	"net/http"
)

type SecurityController struct {
}

func (c *SecurityController) Init(r *mux.Router) {
	r.HandleFunc("/register", c.RegisterHandler).Name("security_register")
	r.HandleFunc("/login", c.LoginHandler).Name("security_login")
	r.HandleFunc("/protected", c.ProtectedTestHandler).Name("security_protected")
}

func (c *SecurityController) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	// Create a new user
	user := models.User{}

	// Setup the form data and validator
	err := r.ParseForm()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	v := validation.NewValidator(r.PostForm)

	if r.Method == "POST" {
		// Validate the input
		v.AddRule("username", validation.NotBlank{})
		v.AddRule("password", validation.NotBlank{})
		v.AddRule("email", validation.Email{})
		v.AddRule("password", validation.Matches{OtherField: "password_confirm"})

		if v.Validate() {
			// Bind the data to the user
			user.Username = r.FormValue("username")
			user.Email = r.FormValue("email")

			hp, err := bcrypt.GenerateFromPassword([]byte(r.FormValue("password")), 0)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			user.Hash = string(hp)

			repo.Users.Insert(user)
		}
	}

	err = template.Render(w, "security_register", &map[string]interface{}{
		"user":   user,
		"errors": v.Errors(),
		"router": app.Router,
	})

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (c *SecurityController) LoginHandler(w http.ResponseWriter, r *http.Request) {
	// Setup the form data and validator
	err := r.ParseForm()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	v := validation.NewValidator(r.PostForm)

	if r.Method == "POST" {
		// Validate the input
		v.AddRule("username", validation.NotBlank{})

		if v.Validate() {
			// Ensure the username exists
			user, err := repo.Users.FindByUsername(r.PostFormValue("username"))

			if err != nil {
				panic("User does not exist")
			}

			// Check the password
			if bcrypt.CompareHashAndPassword([]byte(user.Hash), []byte(r.PostFormValue("password"))) != nil {
				panic("Password is incorrect")
			}

			// Authenticate the user
			session, _ := app.Sessions.Get(r, "security")
			session.Values["token"] = authToken{
				Username:      r.PostFormValue("username"),
				Password:      r.PostFormValue("password"),
				Roles:         []string{},
				Authenticated: true,
				RememberKey:   "",
			}

			err = session.Save(r, w)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			fmt.Println("Logged in")
			url, _ := app.Router.Get("homepage").URL()
			http.Redirect(w, r, url.String(), http.StatusTemporaryRedirect)
		}
	}

	err = template.Render(w, "security_login", &map[string]interface{}{
		"errors": v.Errors(),
		"router": app.Router,
	})

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (c *SecurityController) ProtectedTestHandler(w http.ResponseWriter, r *http.Request) {
	// Get token from session if it exists
	session, _ := app.Sessions.Get(r, "security")
	if token, ok := session.Values["token"].(authToken); ok {
		// Ensure the username exists
		user, err := repo.Users.FindByUsername(token.Username)

		if err != nil {
			panic("User does not exist")
		}

		// Check the password
		if bcrypt.CompareHashAndPassword([]byte(user.Hash), []byte(token.Password)) != nil {
			panic("Password is incorrect")
		}

		fmt.Fprintln(w, "Success!")
		return
	}

	// If no session was found or the token was invalid redirect to the login
	// page
	url, _ := app.Router.Get("security_login").URL()
	http.Redirect(w, r, url.String(), http.StatusTemporaryRedirect)

}

type authToken struct {
	Username      string
	Password      string
	Roles         []string
	Authenticated bool
	RememberKey   string
}

func init() {
	gob.Register(authToken{})
}
