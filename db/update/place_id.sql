update report_setting
set
place_id = $2
where c_id = $1
returning *;