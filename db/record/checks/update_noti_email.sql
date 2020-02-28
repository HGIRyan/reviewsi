update feedback
set noti_email = $2
where cus_id = $1 
returning *;