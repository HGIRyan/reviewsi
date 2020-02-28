insert into feedback 
(cus_id, c_id, email_status )
values
($1, $2, 'First Send')
returning * ;