update login
set 
reset_code = $2
where user_id = $1
returning *;