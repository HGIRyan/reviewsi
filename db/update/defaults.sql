update defaults 
set
email = $2,
leadgen = $3,
winback = $4,
referral = $5, 
cross_sell = $6,
settings = $7,
review_landing = $8,
addon_landing = $9
where industry ilike $1
returning *;
