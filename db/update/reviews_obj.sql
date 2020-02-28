update analytics 
set reviews = $2
where c_id = $1
returning *;