update company
set c_api = $2 
where c_id = $1
returning *;