update report_setting 
set 
from_email = $1,
feedback_alert = $2, 
performance_report = $3
where c_id = $4;