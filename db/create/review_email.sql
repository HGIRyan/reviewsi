insert into review_email
(c_id, s_subject, s_body, fr_subject, fr_body, or_subject, or_body, pr_subject,
pr_body, sr_body, sr_subject, spr_subject, spr_body, positive_landing, passive_landing, demoter_landing)
values
($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)