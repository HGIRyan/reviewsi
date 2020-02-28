update report_setting
set from_email = $2
where c_id = $1
returning *;