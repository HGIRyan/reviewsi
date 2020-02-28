update settings
set
auto_amt = $1,
email_format = $2,
repeat_request = $3
returning *;