select * from company as c
join customer as cus on cus.c_id = c.c_id
join settings as s on s.c_id = c.c_id
where 
cus.cus_id = $2
and c.c_id = $1;