update customer
set last_sent = $2
where gather = $1;