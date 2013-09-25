package validation

import (
	"regexp"
)

type Rule interface {
	Validate(v *Validator, data []string) bool
	Error(data []string) string
}

type Validator struct {
	data    map[string][]string
	rules   map[string][]Rule
	errors  []string
	checked bool
}

func NewValidator(data map[string][]string) *Validator {
	return &Validator{
		data:    data,
		rules:   map[string][]Rule{},
		errors:  []string{},
		checked: false,
	}
}

func (v *Validator) Validate() bool {
	// If the data has already been checked return
	if v.checked {
		return v.Valid()
	}
	// Otherwise start validating the data
	v.checked = true

	// Pre-compile rule regular expressions
	fieldKeyRegexprs := map[string]*regexp.Regexp{}
	for rk, _ := range v.rules {
		fieldKeyRegexprs[rk] = regexp.MustCompile("^" + rk + "$")
	}

	for key, val := range v.data {
		// Check if the key matches any of the rules.
		for rk, rules := range v.rules {
			keyMatch := fieldKeyRegexprs[rk]

			// If this rule matches the key validate the value
			if keyMatch.MatchString(key) {
				for _, rule := range rules {
					if !rule.Validate(v, val) {
						v.errors = append(v.errors, rule.Error(val))
					}
				}
			}
		}
	}

	return v.Valid()
}

func (v *Validator) Valid() bool {
	return v.checked && len(v.errors) == 0
}

func (v *Validator) Errors() []string {
	return v.errors
}

func (v *Validator) AddRule(field string, r Rule) {
	if _, ok := v.rules[field]; !ok {
		v.rules[field] = []Rule{}
	}

	v.rules[field] = append(v.rules[field], r)
}
