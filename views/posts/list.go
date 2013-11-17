package posts

import (
	"github.com/sagittaros/gonews/models"
	"github.com/gorilla/mux"
	"math"
)

type List struct {
	Posts       []models.Post
	Router      *mux.Router
	CurrentPage int
	PageCount   int
	TotalCount  int
}

func (l *List) LastPage() int {
	return int(math.Ceil(float64(l.TotalCount) / float64(l.PageCount)))
}
