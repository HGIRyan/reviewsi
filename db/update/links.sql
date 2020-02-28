update report_setting 
set review_links = $2
where c_id = $1
returning *;