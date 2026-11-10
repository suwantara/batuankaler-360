CREATE TYPE "public"."content_locale" AS ENUM('id', 'en');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."hotspot_type" AS ENUM('navigation', 'information', 'external');--> statement-breakpoint
CREATE TYPE "public"."processing_status" AS ENUM('uploaded', 'processed', 'failed');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "area" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "area_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "area_translation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"area_id" uuid NOT NULL,
	"locale" "content_locale" NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotspot" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scene_id" uuid NOT NULL,
	"target_scene_id" uuid,
	"type" "hotspot_type" NOT NULL,
	"yaw" double precision NOT NULL,
	"pitch" double precision NOT NULL,
	"icon" varchar(64),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotspot_translation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotspot_id" uuid NOT NULL,
	"locale" "content_locale" NOT NULL,
	"label" varchar(200) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"external_url" text
);
--> statement-breakpoint
CREATE TABLE "panorama_asset" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_path" text NOT NULL,
	"tile_base_path" text,
	"thumbnail_path" text NOT NULL,
	"preview_path" text,
	"projection" varchar(32) DEFAULT 'equirectangular' NOT NULL,
	"width" integer NOT NULL,
	"height" integer,
	"config" jsonb,
	"processing_status" "processing_status" DEFAULT 'uploaded' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scene" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"panorama_asset_id" uuid,
	"area_id" uuid,
	"initial_yaw" double precision DEFAULT 0 NOT NULL,
	"initial_pitch" double precision DEFAULT 0 NOT NULL,
	"initial_fov" double precision DEFAULT 1.5707963267948966 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "scene_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "scene_translation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scene_id" uuid NOT NULL,
	"locale" "content_locale" NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "area_translation" ADD CONSTRAINT "area_translation_area_id_area_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."area"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotspot" ADD CONSTRAINT "hotspot_scene_id_scene_id_fk" FOREIGN KEY ("scene_id") REFERENCES "public"."scene"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotspot" ADD CONSTRAINT "hotspot_target_scene_id_scene_id_fk" FOREIGN KEY ("target_scene_id") REFERENCES "public"."scene"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotspot_translation" ADD CONSTRAINT "hotspot_translation_hotspot_id_hotspot_id_fk" FOREIGN KEY ("hotspot_id") REFERENCES "public"."hotspot"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scene" ADD CONSTRAINT "scene_panorama_asset_id_panorama_asset_id_fk" FOREIGN KEY ("panorama_asset_id") REFERENCES "public"."panorama_asset"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scene" ADD CONSTRAINT "scene_area_id_area_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."area"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scene_translation" ADD CONSTRAINT "scene_translation_scene_id_scene_id_fk" FOREIGN KEY ("scene_id") REFERENCES "public"."scene"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE UNIQUE INDEX "area_translation_area_locale_unique" ON "area_translation" USING btree ("area_id","locale");--> statement-breakpoint
CREATE INDEX "hotspot_scene_idx" ON "hotspot" USING btree ("scene_id");--> statement-breakpoint
CREATE INDEX "hotspot_target_scene_idx" ON "hotspot" USING btree ("target_scene_id");--> statement-breakpoint
CREATE UNIQUE INDEX "hotspot_translation_hotspot_locale_unique" ON "hotspot_translation" USING btree ("hotspot_id","locale");--> statement-breakpoint
CREATE INDEX "scene_status_idx" ON "scene" USING btree ("status");--> statement-breakpoint
CREATE INDEX "scene_sort_order_idx" ON "scene" USING btree ("sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "scene_translation_scene_locale_unique" ON "scene_translation" USING btree ("scene_id","locale");