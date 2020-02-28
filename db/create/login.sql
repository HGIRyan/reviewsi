insert into login as l
(c_id, email, username, hash_pass, permission)
values
($1, $2, $3, $4, $5);