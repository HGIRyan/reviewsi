update feedback 
set
email_status = $2,
last_updated = now()
where cus_id = $1