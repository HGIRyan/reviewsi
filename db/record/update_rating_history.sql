update feedback
set 
rating_history = $2
where cus_id = $1
returning *;