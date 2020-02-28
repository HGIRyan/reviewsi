update review_email 
set 
s_body = $2,
s_subject = $3,
or_body = $4,
or_subject = $5,
pr_body = $6,
pr_subject = $7,
fr_body = $8,
fr_subject = $9,
sr_body = $10,
sr_subject = $11,
spr_body = $12,
spr_subject = $13,
signature = $14
where c_id = $1
returning *;