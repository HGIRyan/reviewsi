select * from corporation as cor
left join company as c on c.cor_id = cor.cor_id
left join analytics as anal on anal.c_id = c.c_id
order by c.c_id;