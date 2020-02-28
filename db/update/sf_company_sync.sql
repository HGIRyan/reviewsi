update company
set
active = $2,
active_prod = $3,
c_api = $4
where c_id = $1
returning *;