update feedback 
set
email_status = $3,
opened_time = $2,
last_updated = now(),
updated = true
where cus_id = $1