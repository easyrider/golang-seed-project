package repositories

import (
	. "github.com/dancannon/gonews/models"
	r "github.com/dancannon/gorethink"
)

type voteRepository struct {
}

func (repo *voteRepository) FindById(id string) (Vote, error) {
	var vote Vote
	err := r.Table("votes").Get(id).RunRow(session).Scan(&vote)

	return vote, err
}

func (repo *voteRepository) FindByEntityAndUser(post, user string) (Vote, error) {
	var vote Vote
	err := r.Table("votes").Filter(
		r.Row.Field("Entity").Eq(post).And(r.Row.Field("User").Eq(user)),
	).RunRow(session).Scan(&vote)

	return vote, err
}

func (repo *voteRepository) FindAll() ([]Vote, error) {
	var votes []Vote
	rows, err := r.Table("votes").Run(session)
	if err != nil {
		return votes, err
	}

	for rows.Next() {
		var vote Vote

		err := rows.Scan(&vote)
		if err != nil {
			return votes, err
		}
		votes = append(votes, vote)
	}

	return votes, err
}

func (repo *voteRepository) Store(vote Vote) (Vote, error) {
	response, err := r.Table("votes").Insert(vote).RunWrite(session)

	if err != nil {
		return vote, err
	}

	// Find new ID of product if needed
	if vote.Id == "" && len(response.GeneratedKeys) == 1 {
		vote.Id = response.GeneratedKeys[0]
	}

	return vote, nil
}

func (repo *voteRepository) Update(vote Vote) (Vote, error) {
	_, err := r.Table("votes").Update(vote).RunWrite(session)

	if err != nil {
		return vote, err
	}

	return vote, nil
}

func (repo *voteRepository) Delete(id string) error {
	return r.Table("votes").Get(id).Delete().Exec(session)
}

func (repo *voteRepository) DeleteAll() error {
	return r.Table("votes").Delete().Exec(session)
}
