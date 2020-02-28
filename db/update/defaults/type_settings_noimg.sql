update settings
set
auto_amt = $1,
email_format = $2,
repeat_request = $3
from company
where settings.c_id = company.c_id and lower(company.industry) = lower($4)
returning *;