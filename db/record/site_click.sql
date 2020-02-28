update feedback 
set 
click_site = $2,
click = true,
email_status = 'open',
last_updated = now()
where
cus_id = $1
returning *; 