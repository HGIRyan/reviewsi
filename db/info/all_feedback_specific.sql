select * from feedback as f
join customer as c on c.cus_id = f.cus_id
where c.c_id = $1;