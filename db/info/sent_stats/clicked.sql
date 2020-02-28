select count(*) from feedback
where 
click is true
and created >= $1;