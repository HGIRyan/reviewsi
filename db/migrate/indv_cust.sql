insert into customer 
(c_id, first_name, last_name, email, phone, service, last_sent, activity, date_added, last_updated, active, cor_id, gather)
values
($1, $2, $3, $4, $5, 'reviews',$6, $7, $8, now(), $9, $10, $11)
returning *;