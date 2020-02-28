----------------------------------------------------------------------------------
--No Open Reminder

select *, c.cus_id as id from customer as c
left join feedback as f on c.cus_id = f.cus_id
where 
lower(c.service) =lower('reviews')
and c.active = true
and c.c_id = $1
and c.last_sent like concat($2,'%')
and lower(f.last_email) =lower('First Send')
and lower(f.last_email) !=lower('First Reminder')
and lower(f.email_status) != lower('open')
and (f.click = false or f.click is null)
and (f.rating is null)
order by c.cus_id;




-- select *, c.cus_id as id from customer as c
-- left join feedback as f on c.cus_id = f.cus_id
-- where 
-- lower(c.service) =lower('reviews')
-- and c.service !='unsubscribed'
-- and
-- c.active = true
-- and
-- c.c_id = $1
-- and
-- c.last_sent like concat($2,'%')
-- and c.loc = $3
-- and lower(f.last_email) =lower('First Send')
-- and f.email_status !='open'
-- and f.click = false
-- and (f.rating is null or f.rating >= 3)
-- order by c.last_sent;

----------------------------------------------------------------------------------
-- select *, c.cus_id as id from customer as c
-- left join feedback as f on c.cus_id = f.cus_id
-- where 
-- c.service = 'reviews'
-- and c.service != 'unsubscribed'
-- and
-- c.active = true
-- and
-- c.c_id = $1 
-- and
-- c.last_sent = $2
-- and c.loc = $3
-- and f.email = 'First Send'
-- and f.email != 'open'
-- and f.click = false
-- and rating = NULL
-- order by c.last_sent;