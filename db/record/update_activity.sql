update customer
set
activity = $2
where cus_id = $1
returning *;