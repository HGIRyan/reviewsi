insert into company as c 
(cor_id, industry, company_name, owner_name, address, phone, email, utc_offset, geo, active_prod)
values 
($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
returning *;