select *, c.cus_id as cus_id, f.cus_id as id from customer as c 
left join feedback as f on f.cus_id = c.cus_id
where c.cor_id = $1;