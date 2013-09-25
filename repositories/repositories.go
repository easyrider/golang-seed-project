package repositories

import (
	. "github.com/dancannon/gonews/models"
)

var (
	Posts *postRepository
	Users *userRepository
)

type Repository interface {
	FindById(id int) (Model, error)
	FindAll() ([]Model, error)
	Store(model Model) (Model, error)
	Delete(id int) error
}
