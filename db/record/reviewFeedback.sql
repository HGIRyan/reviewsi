update feedback
set
rating = $2,
email_status = 'open',
opened_time = $3,
source = $4
where 
cus_id = $1
returning * ;