update company set cor_id = $1 where c_id = $2
returning * ;
