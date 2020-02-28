insert into corporation as cor
(industry, cor_name, cor_email, agent_id)
values 
($1, $2, $3, $4)
returning *;