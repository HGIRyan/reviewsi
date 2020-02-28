update feedback
set 
click = $2,
last_email = $3,
last_updated = now(),
updated = false
where cus_id = $1

-- First Initial Feedback Refresh of feedback