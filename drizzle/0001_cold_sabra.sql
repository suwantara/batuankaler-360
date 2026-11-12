CREATE TABLE "site_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(80) NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"manager_name" varchar(200) DEFAULT '' NOT NULL,
	"manager_url" text DEFAULT '' NOT NULL,
	"map_url" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_content_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_content_translation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" uuid NOT NULL,
	"locale" "content_locale" NOT NULL,
	"heritage_label" varchar(120) DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"visiting_hours" text DEFAULT '' NOT NULL,
	"access" text DEFAULT '' NOT NULL,
	"dress_code" text DEFAULT '' NOT NULL,
	"photo_policy" text DEFAULT '' NOT NULL,
	"etiquette" text DEFAULT '' NOT NULL,
	"contact" text DEFAULT '' NOT NULL,
	"verification_note" varchar(300) DEFAULT '' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "site_content_translation" ADD CONSTRAINT "site_content_translation_content_id_site_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "site_content_translation_content_locale_unique" ON "site_content_translation" USING btree ("content_id","locale");