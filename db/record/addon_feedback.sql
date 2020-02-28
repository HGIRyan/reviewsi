update feedback 
set
click = true,
email_status = 'clicked',
source = 'email',
last_updated = now()
where cus_id = $1
returning *;