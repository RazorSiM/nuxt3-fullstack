ALTER TABLE "users" ADD CONSTRAINT "users_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_address_unique" UNIQUE("address");