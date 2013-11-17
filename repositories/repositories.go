package repositories

import (
	. "github.com/sagittaros/gonews/models"
)

var (
	Comments *commentRepository
	Posts    *postRepository
	Users    *userRepository
	Votes    *voteRepository
)

type Repository interface {
	FindById(id int) (Model, error)
	FindAll() ([]Model, error)
	Store(model Model) (Model, error)
	Delete(id int) error
}
