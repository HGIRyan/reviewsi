update company 
set 
company_name = $2,
owner_name = $3,
address = $4,
phone = $5,
email = $6,
active_prod = $7,
utc_offset = $8,
geo = $9,
c_api = $10
where c_id = $1
returning * ;