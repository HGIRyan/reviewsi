update report_setting
set
place_id = $2,
review_links = $3,
feedback_alert = $4
where
c_id = $1;