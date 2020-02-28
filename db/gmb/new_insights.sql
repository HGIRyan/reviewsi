update gmb
set insights = $2
where location_id = $1
returning *;