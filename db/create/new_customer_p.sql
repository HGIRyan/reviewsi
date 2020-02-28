insert into customer as c
(c_id, first_name, last_name, phone, service, last_sent, activity, cor_id)
values 
($1, $2, $3, $4, $5, '2005-05-25',$7, $8)
returning *;