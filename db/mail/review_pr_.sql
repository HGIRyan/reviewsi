----------------------------------------------------------------------------------
-- Positive Feedback No Click Reminder

select *, c.cus_id as id from customer as c
left join feedback as f on c.cus_id = f.cus_id
where 
lower(c.service) = lower('reviews')
and lower(f.last_email) != lower('positive reminder')
and lower(f.last_email) != lower('Second positive reminder')
and f.last_email is not null 
and c.active = true
and c.c_id = $1
-- and lower(f.email_status) = lower('open')
and f.opened_time like concat ($2, '%')
and f.rating >= 3
and f.click = false
order by c.last_sent;


-- select *, c.cus_id as id from customer as c
-- left join feedback as f on c.cus_id = f.cus_id
-- where 
-- lower(c.service) = lower('reviews')
-- and f.last_email != 'positive reminder' and f.last_email is not null
-- and c.service != 'unsubscribed'
-- and c.active = true
-- and c.c_id = $1
-- and f.opened_time like concat ($2, '%')
-- and c.loc = $3
-- and f.rating >= 3
-- and f.click = false
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
-- and f.rating != NULL
-- and click = false
-- order by c.last_sent

