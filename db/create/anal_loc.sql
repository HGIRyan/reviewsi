update analytics 
set
checklist = $2,
customers = $3,
reviews = $4
where 
c_id = $1;