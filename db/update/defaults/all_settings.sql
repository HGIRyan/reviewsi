update settings
set
auto_amt = $1,
email_format = $2,
repeat_request = $3,
logo = $4,
accent_color = $5
returning *;