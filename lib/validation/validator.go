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
	// Pre-compile rule regular expressions
	fieldKeyRegexprs := map[string]*regexp.Regexp{}
	for rk, _ := range v.rules {
		fieldKeyRegexprs[rk] = regexp.MustCompile("^" + rk + "$")
	}

	// Check if the key matches any of the rules.
	for key, val := range v.data {
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

	v.checked = true

	return v.Valid()
}

func (v *Validator) Valid() bool {
	return v.checked && len(v.errors) == 0
}

func (v *Validator) Errors() []string {
	return v.errors
}

func (v *Validator) AddError(message string) {
	v.errors = append(v.errors, message)
}

func (v *Validator) AddRule(field string, r Rule) {
	if _, ok := v.rules[field]; !ok {
		v.rules[field] = []Rule{}
	}

	v.rules[field] = append(v.rules[field], r)
}
