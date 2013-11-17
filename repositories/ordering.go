package repositories

import (
	r "github.com/sagittaros/gorethink"
)

// Generic sorting functions
func orderByTop(row r.RqlTerm) r.RqlTerm {
	return row.Field("Likes").Sub(row.Field("Dislikes"))
}

func orderByNew(row r.RqlTerm) r.RqlTerm {
	return row.Field("Created")
}
