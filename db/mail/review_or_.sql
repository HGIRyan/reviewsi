----------------------------------------------------------------------------------
-- Opened Reminder
select *, c.cus_id as id from customer as c
left join feedback as f on c.cus_id = f.cus_id
where 
lower(c.service) =lower('reviews')
and c.active = true
and c.c_id = $1
and f.opened_time like concat($2,'%')
and f.email_status ='open'
and (lower(f.last_email) = lower('first send') or lower(f.last_email) = lower('first reminder') or lower(f.last_email) = lower('second reminder'))
and lower(f.last_email) != lower('Open Reminder')
and f.click = false
and (f.rating is NULL)
order by c.last_sent;


-- select *, c.cus_id as id from customer as c
-- left join feedback as f on c.cus_id = f.cus_id
-- where 
-- lower(c.service) =lower('reviews')
-- and c.service !='unsubscribed'
-- and c.active = true
-- and c.c_id = $1
-- and f.opened_time like concat($2,'%')
-- and c.loc = $3
-- and f.email_status ='open'
-- and (lower(f.last_email) = lower('first send') or lower(f.last_email) = lower('first reminder'))
-- and f.click = false
-- and (f.rating is NULL or f.rating >= 3)
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
-- c.opened_time like '%'$2'%' --Find Time Similar To Opened Time. Same Day but can be any hour
-- and c.loc = $3
-- and f.email_status = 'open'
-- and f.click = false
-- and rating = NULL
-- order by c.last_sent;