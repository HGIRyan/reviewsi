select count(*) from feedback
where 
opened_time is not null
and created >= $1;