select *from company as c
join analytics as a on a.c_id = c.c_id
join report_setting as rs on rs.c_id = c.c_id
join settings as s on s.c_id = c.c_id
where c.active is true
order by c.c_id;