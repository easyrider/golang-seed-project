package models

import (
	"time"
)

type Comment struct {
	Id         string `gorethink:"id,omitempty"`
	Post       string `schema:"post"`
	Parent     string `schema:"parent"`
	Depth      int
	AuthorId   string
	AuthorName string
	Content    string `schema:"content"`
	Likes      int
	Dislikes   int
	Created    time.Time
	Modified   time.Time
}
