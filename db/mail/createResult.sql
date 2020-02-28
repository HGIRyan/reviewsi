insert into result
(cus_id, c_id, source ,service)
values
($1, $2, $3, $4)
returning * ;