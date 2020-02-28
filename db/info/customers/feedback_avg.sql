select AVG(f.rating) from customer as c 
left join feedback as f on f.cus_id = c.cus_id 
where c.c_id = $1;