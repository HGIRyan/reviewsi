update review_email
set
positive_landing = $2,
passive_landing = $3,
demoter_landing = $4
from company 
where review_email.c_id = company.c_id and lower(company.industry) = lower($1)
returning *;