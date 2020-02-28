update defaults
set
email = $2,
settings = $3
where LOWER(industry) = LOWER($1)