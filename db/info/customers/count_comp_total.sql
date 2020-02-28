select count(c.cus_id) as total, 
(select count(c.cus_id) from customer as c
left join feedback as f on f.cus_id = c.cus_id
where c.c_id = $1
and (f.f_id is null or f.rating > 2 or f.rating is null)
and (f.click = false or f.click is null)
and c.active = true 
and c.service = 'reviews'
and c.last_sent <= $2
) as remaining
from customer as c
where c.c_id = $1
and c.service = 'reviews';