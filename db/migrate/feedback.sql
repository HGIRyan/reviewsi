insert into feedback
(cus_id, feedback_text, rating, click, email_status, last_email, rating_history, updated)
values
($1, 'N/A', $2, $3, $4, $5, $6, $7)
returning * ;