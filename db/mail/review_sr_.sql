select *, c.cus_id as id from customer as c
left join feedback as f on c.cus_id = f.cus_id
where
lower(c.service) =lower('reviews')
and c.active = true
and c.c_id = $1
and c.last_sent like concat($2,'%')
and lower(f.last_email) =lower('First Reminder')
and lower(f.last_email) !=lower('Second Reminder')
and lower(f.email_status) != lower('open')
and (f.click = false or f.click is null)
and (f.rating is null)
order by c.cus_id;