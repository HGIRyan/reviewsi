update report_setting
set 
from_email = $1
from company 
where report_setting.c_id = company.c_id and lower(company.industry) = lower($1)
returning *;