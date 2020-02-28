update feedback
set feedback_text = $2
from customer
where customer.gather = $1 and customer.cus_id = feedback.cus_id;