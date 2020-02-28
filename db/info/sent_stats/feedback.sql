select count(*) from feedback
where 
rating is not null
and created >= $1;