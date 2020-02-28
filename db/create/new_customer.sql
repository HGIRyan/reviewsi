insert into customer as c
(c_id, first_name, last_name, email, phone, service, last_sent, activity, cor_id)
values 
($1, $2, $3, $4, $5, $6, '2005-05-25', $8, $9)
returning *;