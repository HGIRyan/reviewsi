select s.*, c.*, c.c_id as id from settings as s
left join company as c on c.c_id = s_id
left join corporation as cor on cor.cor_id = c.cor_id
where cor.agent_id = $1;