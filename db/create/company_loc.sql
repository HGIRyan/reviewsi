update company
set 
company_name = $2,
address = $3,
phone = $4,
email = $5,
geo = $6,
active = $7,
reviews = $8,
cross_sell = $9,
referral = $10,
winback = $11,
leadgen = $12
where 
c_id = $1;