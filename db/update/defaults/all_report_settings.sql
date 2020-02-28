update report_setting
set 
from_email = $1
returning *;