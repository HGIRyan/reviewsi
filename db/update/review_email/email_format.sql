update settings 
set 
email_format = $2
where c_id = $1
returning *;