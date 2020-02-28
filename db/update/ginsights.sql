update analytics 
set
calls = $2, 
website = $3,
direction = $4,
messages = $5,
searches = $6
where c_id = $1
returning *;