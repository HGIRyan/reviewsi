insert into review_history
(c_id, date, status, reviews, rating_info)
values
($1, $2, $3, $4, $5)
returning *;