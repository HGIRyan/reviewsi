update settings 
set auto_amt = $2
where c_id = $1
returning *;