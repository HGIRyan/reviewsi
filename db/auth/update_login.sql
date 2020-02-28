update login 
set 
email = $2,
username = $3,
hash_pass = $4
where user_id = $1
returning *;