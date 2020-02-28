select * from feedback where cus_id = $1 and (noti_email != $2 or noti_email is null);
