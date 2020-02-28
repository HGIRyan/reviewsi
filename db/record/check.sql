select f.*, c.*, comp.utc_offset from feedback as f 
join customer as c on c.cus_id = f.cus_id
join company as comp on comp.c_id = c.c_id
where
f.cus_id = $1;