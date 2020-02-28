insert into feedback 
(cus_id)
values
($1)
returning *;