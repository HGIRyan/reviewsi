insert into corporation as cor
(industry, cor_name, cor_email)
values 
($1, $2, $3)
returning *;