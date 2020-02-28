update customer
set
 active = false,
 last_updated = $2
 where cus_id = $1;
