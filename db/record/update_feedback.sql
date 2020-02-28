update feedback
set 
last_email = $2,
last_updated = now(),
updated = false
where cus_id = $1;

-- First Initial Feedback Refresh of feedback