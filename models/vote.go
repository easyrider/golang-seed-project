package models

type Vote struct {
	Id   string `gorethink:"id,omitempty"`
	Post string
	User string
	Type string
}
