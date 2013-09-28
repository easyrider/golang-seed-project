package models

import (
	"math"
	"strconv"
	"time"
)

const (
	PostTypeLink = "link"
	PostTypeText = "text"

	LinkTypeArticle = "article"

	VoteTypeLike    = "like"
	VoteTypeDislike = "dislike"
)

type Post struct {
	Id         string `gorethink:"id,omitempty"`
	AuthorId   string
	AuthorName string
	Type       string `schema:"type"`
	Title      string `schema:"title"`
	Content    string `schema:"content"`
	Meta       map[string]string
	Tags       []string
	Likes      int
	Dislikes   int
	Created    time.Time
	Modified   time.Time
}

func (p *Post) Score() string {
	return strconv.Itoa(p.Likes - p.Dislikes)
}

func (p *Post) IsType(t string) bool {
	return p.Type == t
}

func (p *Post) Rank() float64 {
	var score = float64(p.Likes - p.Dislikes)
	var order = math.Log10(math.Max(math.Abs(score), 1))
	var sign int64
	if score < 1 {
		sign = -1
	} else {
		sign = 1
	}
	var seconds = p.Created.Unix() - 1134028003

	return (order + float64((sign*seconds)/45000))
}
