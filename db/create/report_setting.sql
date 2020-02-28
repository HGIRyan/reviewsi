insert into report_setting as rs 
(c_id, from_email, place_id, performance_report, feedback_alert, report_history, review_links)
values
($1, $2, $3, $4, $5, $6, $7);