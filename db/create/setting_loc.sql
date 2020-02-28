update settings
set
auto_amt = $2,
email_format = $3,
request_process = $4,
repeat_request = $5,
first_reminder = $6,
open_reminder = $7,
positive_reminder = $8,
logo = $9,
accent_color = $10
where
c_id = $1;