update review_email
set
s_subject = $1,
s_body = $2,
fr_subject = $3,
fr_body = $4,
or_subject = $5,
or_body = $6,
pr_subject = $7,
pr_body = $8,
sr_subject = $9,
sr_body = $10,
spr_subject = $11,
spr_body = $12
from company 
where review_email.c_id = company.c_id and lower(company.industry) = lower($13)
returning *;