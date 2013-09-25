package models

import (
	"time"
)

type Role string

const (
	ROLE_ADMIN string = "ADMIN"
)

type User struct {
	Id       string `gorethink:"id,omitempty"`
	Username string
	Email    string
	Hash     string
	Active   bool
	// Roles     []string
	LastVisit time.Time
	Created   time.Time
	Modified  time.Time
}
