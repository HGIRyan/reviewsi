CREATE TABLE "company" (
	"c_id" serial NOT NULL,
	"industry" varchar(255) NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"owner_name" json NOT NULL DEFAULT '{"first":"", "last":""}',
	"address" json NOT NULL DEFAULT '{"address":[{"street":"", "city":"", "zip":"", "state":""}]}',
	"phone" json NOT NULL DEFAULT '{"phone":[]}',
	"email" json NOT NULL DEFAULT '{"email":[]}',
	"utc_offset" varchar(255) NOT NULL,
	"geo" json NOT NULL DEFAULT '{"geo":[]}',
	"active" BOOLEAN NOT NULL,
	"created" TIMESTAMP NOT NULL,
	"reviews" BOOLEAN NOT NULL,
	"cross" BOOLEAN NOT NULL,
	"referall" BOOLEAN NOT NULL,
	"winback" BOOLEAN NOT NULL,
	"leadgen" BOOLEAN NOT NULL,
	CONSTRAINT "company_pk" PRIMARY KEY ("c_id")
) ;



CREATE TABLE "settings" (
	"s_id" serial NOT NULL,
	"c_id" integer NOT NULL,
	"auto_amt" json NOT NULL DEFAULT '{"amt":[]}',
	"email_format" json NOT NULL DEFAULT '{"format":[]}',
	"request_process" json NOT NULL DEFAULT '{"process":[]}',
	"repeat_request" json NOT NULL DEFAULT '{"repeat":[]}',
	"first_reminder" json NOT NULL DEFAULT '{"first":[]}',
	"open_reminder" json NOT NULL DEFAULT '{"open":[]}',
	"positive_reminder" json NOT NULL,
	"logo" json NOT NULL DEFAULT '{"logo":[]}',
	"accent_color" json NOT NULL DEFAULT '{"accent":[]}',
	"created" TIMESTAMP NOT NULL,
	CONSTRAINT "settings_pk" PRIMARY KEY ("s_id")
);



CREATE TABLE "report_setting" (
	"rs_id" serial NOT NULL,
	"c_id" integer NOT NULL,
	"from_email" varchar(255) NOT NULL,
	"place_id" varchar(255) NOT NULL,
	"report_frequency" integer NOT NULL,
	"review_links" json NOT NULL DEFAULT '{"links":[]}',
	"feedback_alert" json NOT NULL DEFAULT '{"alert":[]}',
	"depleated_list" json NOT NULL DEFAULT '{"alert":[]}',
	"performance_report" json NOT NULL DEFAULT '{"report":[]}',
	"updated" TIMESTAMP NOT NULL,
	CONSTRAINT "report_setting_pk" PRIMARY KEY ("rs_id")
);



CREATE TABLE "analytics" (
	"a_id" serial NOT NULL,
	"c_id" integer NOT NULL,
	"calls" json NOT NULL DEFAULT '{"calls":[]}',
	"website" json NOT NULL DEFAULT '{"website":[]}',
	"direction" json NOT NULL DEFAULT '{"direction":[]}',
	"messages" json NOT NULL DEFAULT '{"message":[]}',
	"searches" json NOT NULL DEFAULT '{"search":[]}',
	"checklist" json NOT NULL DEFAULT '{"list":[]}',
	"reviews" json NOT NULL DEFAULT '{"reviews":[]}',
	"ranking" json NOT NULL DEFAULT '{"rank":[]}',
	"rank_key" json NOT NULL DEFAULT '{"keys":[]}',
	"created" TIMESTAMP NOT NULL,
	CONSTRAINT "analytics_pk" PRIMARY KEY ("a_id")
);



CREATE TABLE "feedback" (
	"f_id" serial NOT NULL,
	"cus_id" integer NOT NULL,
	"feedback_text" varchar(255) NOT NULL,
	"rating" integer NOT NULL,
	"click" BOOLEAN NOT NULL,
	"opened" BOOLEAN NOT NULL,
	"opened_time" varchar(255) NOT NULL,
	"click_site" varchar(255) NOT NULL,
	"source" varchar(255) NOT NULL,
	"created" TIMESTAMP NOT NULL,
	CONSTRAINT "feedback_pk" PRIMARY KEY ("f_id")
);



CREATE TABLE "customer" (
	"cus_id" serial NOT NULL,
	"c_id" integer NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(255) NOT NULL,
	"service" varchar(255) NOT NULL,
	"last_sent" varchar(255) NOT NULL,
	"activity" json NOT NULL DEFAULT '{"active":[]}',
	"date_added" TIMESTAMP NOT NULL,
	"updated" TIMESTAMP NOT NULL,
	"active" BOOLEAN NOT NULL,
	CONSTRAINT "customer_pk" PRIMARY KEY ("cus_id")
);



CREATE TABLE "review_email" (
	"re_id" serial NOT NULL,
	"c_id" integer NOT NULL,
	"s_subject" varchar(255) NOT NULL,
	"s_body" json NOT NULL DEFAULT '{"s":[]}',
	"fr_subject" varchar(255) NOT NULL,
	"fr_body" json NOT NULL DEFAULT '{"fr":[]}',
	"or_subject" varchar(255) NOT NULL,
	"or_body" json NOT NULL DEFAULT '{"or":[]}',
	"pr_subject" varchar(255) NOT NULL,
	"pr_body" json NOT NULL DEFAULT '{"pr":[]}',
	"positive_landing" varchar(255) NOT NULL,
	"passive_landing" varchar(255) NOT NULL,
	"demoter_landing" varchar(255) NOT NULL,
	CONSTRAINT "review_email_pk" PRIMARY KEY ("re_id")
);



CREATE TABLE "result" (
	"res_id" serial NOT NULL,
	"cus_id" integer NOT NULL,
	"name" json NOT NULL DEFAULT '{"first_name":"", "last_name":""}',
	"contact" json NOT NULL DEFAULT '{"phone":"", "email":""}',
	"interested" BOOLEAN NOT NULL,
	"opened" BOOLEAN NOT NULL,
	"opened_time" varchar(255) NOT NULL,
	"source" varchar(255) NOT NULL,
	"service" varchar(255) NOT NULL,
	"created" TIMESTAMP NOT NULL,
	CONSTRAINT "result_pk" PRIMARY KEY ("res_id")
);



CREATE TABLE "addon_emails" (
	"le_id" serial NOT NULL,
	"c_id" integer NOT NULL,
	"email_1" json NOT NULL DEFAULT '{"referral":{"subject":"", "body":""}, "lead_gen":{"subject":"", "body":""},"cross":{"subject":"", "body":""},"win":{"subject":"", "body":""}}',
	"email_2" json NOT NULL DEFAULT '{"referral":{"subject":"", "body":""}, "lead_gen":{"subject":"", "body":""},"cross":{"subject":"", "body":""},"win":{"subject":"", "body":""}}',
	"email_3" json NOT NULL DEFAULT '{"referral":{"subject":"", "body":""}, "lead_gen":{"subject":"", "body":""},"cross":{"subject":"", "body":""},"win":{"subject":"", "body":""}}',
	"email_4" json NOT NULL DEFAULT '{"referral":{"subject":"", "body":""}, "lead_gen":{"subject":"", "body":""},"cross":{"subject":"", "body":""},"win":{"subject":"", "body":""}}',
	"email_5" json NOT NULL DEFAULT '{"referral":{"subject":"", "body":""}, "lead_gen":{"subject":"", "body":""},"cross":{"subject":"", "body":""},"win":{"subject":"", "body":""}}',
	"email_6" json NOT NULL DEFAULT '{"referral":{"subject":"", "body":""}, "lead_gen":{"subject":"", "body":""},"cross":{"subject":"", "body":""},"win":{"subject":"", "body":""}}',
	CONSTRAINT "addon_emails_pk" PRIMARY KEY ("le_id")
);



CREATE TABLE "login" (
	"user_id" serial NOT NULL,
	"c_id" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"hash_pass" varchar(500) NOT NULL,
	"permission" varchar(20) NOT NULL,
	"updated" TIMESTAMP NOT NULL,
	"created" TIMESTAMP NOT NULL,
	CONSTRAINT "login_pk" PRIMARY KEY ("user_id")
);

CREATE TABLE "defaults" (
	"def_id" serial NOT NULL,
	"industry" varchar(255) NOT NULL,
	"email" json NOT NULL DEFAULT '{"Standard": {"subject": "","Body": { "body": "", "thanks": "" }},"First": {"subject": "","Body": { "body": "", "thanks": "" }},"Opened": {"subject": "","Body": { "body": "", "thanks": "" }},"Positive": {"subject": "","Body": { "body": "", "thanks": "" }} }',
	"lead" json NOT NULL DEFAULT '{ "email_1":"", "email_2":"", "email_3":"", "email_4":"", "email_5":"", "email_6":""}',
	"win" json NOT NULL DEFAULT '{ "email_1":"", "email_2":"", "email_3":"", "email_4":"", "email_5":"", "email_6":""}',
	"ref" json NOT NULL DEFAULT '{ "email_1":"", "email_2":"", "email_3":"", "email_4":"", "email_5":"", "email_6":""}',
	"cross" json NOT NULL DEFAULT '{ "email_1":"", "email_2":"", "email_3":"", "email_4":"", "email_5":"", "email_6":""}',
	"settings" json NOT NULL DEFAULT '{"auto_amt":1,"email_format":1,"Process":1,"repeat":180,"first":2,"open":2,"positive":1,"logo":"","color":"","frequency":30 }',
	"review_landing" json NOT NULL DEFAULT '{"positive":{"thanks":"","body":""}, "passive":{"thanks":"","body":""}, "demoter":{"thanks":"","body":""}}',
	"addon_landing" json NOT NULL DEFAULT '{"leadgen":"", "winback":"", "referral":"", "cross":""}'
	CONSTRAINT "defaults_pk" PRIMARY KEY ("def_id")
);





ALTER TABLE "settings" ADD CONSTRAINT "settings_fk0" FOREIGN KEY ("c_id") REFERENCES "company"("c_id");

ALTER TABLE "report_setting" ADD CONSTRAINT "report_setting_fk0" FOREIGN KEY ("c_id") REFERENCES "company"("c_id");

ALTER TABLE "analytics" ADD CONSTRAINT "analytics_fk0" FOREIGN KEY ("c_id") REFERENCES "company"("c_id");

ALTER TABLE "feedback" ADD CONSTRAINT "feedback_fk0" FOREIGN KEY ("cus_id") REFERENCES "customer"("cus_id");

ALTER TABLE "customer" ADD CONSTRAINT "customer_fk0" FOREIGN KEY ("c_id") REFERENCES "company"("c_id");

ALTER TABLE "review_email" ADD CONSTRAINT "review_email_fk0" FOREIGN KEY ("c_id") REFERENCES "company"("c_id");

ALTER TABLE "result" ADD CONSTRAINT "result_fk0" FOREIGN KEY ("cus_id") REFERENCES "customer"("cus_id");

ALTER TABLE "addon_emails" ADD CONSTRAINT "addon_emails_fk0" FOREIGN KEY ("c_id") REFERENCES "company"("c_id");

ALTER TABLE "login" ADD CONSTRAINT "login_fk0" FOREIGN KEY ("c_id") REFERENCES "company"("c_id");
