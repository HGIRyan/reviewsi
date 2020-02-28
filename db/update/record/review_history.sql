insert into review_history
(c_id, date, status, reviews)
values
($1, now(), $3, $2)
returning *;