update feedback
set
feedback_text = $2,
email_status = 'open',
last_updated = now()
where
cus_id = $1
returning *;