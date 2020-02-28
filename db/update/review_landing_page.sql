update review_email
set
passive_landing = $2,
positive_landing = $3,
demoter_landing = $4
where c_id = $1;
