CREATE TABLE "site_page" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(80) NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_page_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_page_block" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"type" varchar(32) DEFAULT 'section' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_page_block_translation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"block_id" uuid NOT NULL,
	"locale" "content_locale" NOT NULL,
	"heading" varchar(300) DEFAULT '' NOT NULL,
	"body" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_page_translation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"locale" "content_locale" NOT NULL,
	"eyebrow" varchar(200) DEFAULT '' NOT NULL,
	"title" varchar(300) DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"verification_note" varchar(500) DEFAULT '' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "site_page_block" ADD CONSTRAINT "site_page_block_page_id_site_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."site_page"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_page_block_translation" ADD CONSTRAINT "site_page_block_translation_block_id_site_page_block_id_fk" FOREIGN KEY ("block_id") REFERENCES "public"."site_page_block"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_page_translation" ADD CONSTRAINT "site_page_translation_page_id_site_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."site_page"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "site_page_block_page_order_idx" ON "site_page_block" USING btree ("page_id","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "site_page_block_translation_block_locale_unique" ON "site_page_block_translation" USING btree ("block_id","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "site_page_translation_page_locale_unique" ON "site_page_translation" USING btree ("page_id","locale");