update review_email
set
positive_landing = $1,
passive_landing = $2,
demoter_landing = $3
returning *;
