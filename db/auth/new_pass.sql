update login
set hash_pass = $2
where user_id = $1;