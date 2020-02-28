update customer
set active = $3
where c_id = $1 and cus_id = $2;