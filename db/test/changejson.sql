update company
set
company_name = $2,
reviews = $3,
cross_sell = $4,
referral = $5,
winback = $6,
leadgen = $7
where 
c_id = $1;