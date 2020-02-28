update feedback 
set
rating = null,
opened_time = null,
email_status = 'processing'
where f_id = $1;