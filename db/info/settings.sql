select * from settings as s
join report_setting as rs on rs.c_id = s.c_id
where s.c_id = $1;