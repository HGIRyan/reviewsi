update defaults
set
review_landing = $2
where LOWER(industry) = LOWER($1)