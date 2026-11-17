CREATE TABLE "gallery_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_path" text NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_item_translation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"locale" "content_locale" NOT NULL,
	"title" varchar(200) DEFAULT '' NOT NULL,
	"caption" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gallery_item_translation" ADD CONSTRAINT "gallery_item_translation_item_id_gallery_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."gallery_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "gallery_item_status_idx" ON "gallery_item" USING btree ("status");--> statement-breakpoint
CREATE INDEX "gallery_item_sort_order_idx" ON "gallery_item" USING btree ("sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "gallery_item_translation_item_locale_unique" ON "gallery_item_translation" USING btree ("item_id","locale");