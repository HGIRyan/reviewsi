update report_setting
set 
from_email = $2,
feedback_alert = $3,
performance_report = $4
where c_id = $1