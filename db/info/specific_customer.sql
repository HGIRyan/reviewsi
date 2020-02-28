select *, c.cus_id as id from customer as c
left join feedback as f on c.cus_id = f.cus_id
where c.c_id = $1 and c.cus_id = $2;