update company
set active = $2 where c_id = $1
returning * ;