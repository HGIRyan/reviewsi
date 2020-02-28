insert into customer
(c_id, first_name, last_name, email, phone, service, last_sent, activity, active, cor_id, gather)
values
($1, $2, $3, $4, $5, 'reviews', '//////', $6, $7, $8, $9)
returning *;