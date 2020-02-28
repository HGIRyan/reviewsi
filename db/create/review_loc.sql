update review_email
set
s_body = $2,
fr_body = $3,
or_body = $4,
pr_body = $5
where
c_id = $1;