select c.cus_id as id, c.c_id as cid,c.service as c_service,* from customer as c
left join feedback as f on f.cus_id = c.cus_id
left join result as r on r.cus_id = c.cus_id
where c.c_id = $1;