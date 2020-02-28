update customer
set
last_sent = $2,
activity = $3
where cus_id = $1
returning *;