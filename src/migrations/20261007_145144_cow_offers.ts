import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_cow_offers_health_vaccinations" AS ENUM('fmd', 'hs', 'bq', 'lsd', 'brucellosis', 'theileria');
  CREATE TYPE "public"."enum_cow_offers_status" AS ENUM('new', 'contacted', 'visit', 'bought', 'rejected');
  CREATE TYPE "public"."enum_cow_offers_cow_milking_status" AS ENUM('milking', 'dry', 'heifer');
  CREATE TYPE "public"."enum_cow_offers_cow_pregnant" AS ENUM('yes', 'no', 'unknown');
  CREATE TYPE "public"."enum_cow_offers_cow_calf" AS ENUM('none', 'female', 'male');
  CREATE TYPE "public"."enum_cow_offers_cow_papers" AS ENUM('yes', 'no', 'unknown');
  CREATE TYPE "public"."enum_cow_offers_health_dewormed" AS ENUM('yes', 'no', 'unknown');
  CREATE TYPE "public"."enum_cow_offers_sale_transport" AS ENUM('seller', 'buyer', 'discuss');
  CREATE TYPE "public"."enum_cow_offer_files_kind" AS ENUM('photo', 'video');
  CREATE TABLE "cow_offers_health_vaccinations" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_cow_offers_health_vaccinations",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cow_offers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_cow_offers_status" DEFAULT 'new',
  	"internal_notes" varchar,
  	"locale" varchar,
  	"title" varchar,
  	"phone" varchar,
  	"expected_price" numeric,
  	"seller_name" varchar NOT NULL,
  	"seller_phone" varchar NOT NULL,
  	"seller_whatsapp" varchar,
  	"seller_email" varchar,
  	"seller_village" varchar NOT NULL,
  	"seller_district" varchar,
  	"seller_state" varchar,
  	"seller_pincode" varchar,
  	"cow_breed" varchar NOT NULL,
  	"cow_breed_other" varchar,
  	"cow_age_years" numeric,
  	"cow_calvings" numeric,
  	"cow_milking_status" "enum_cow_offers_cow_milking_status",
  	"cow_milk_per_day" numeric,
  	"cow_last_calving" varchar,
  	"cow_pregnant" "enum_cow_offers_cow_pregnant",
  	"cow_pregnant_months" numeric,
  	"cow_calf" "enum_cow_offers_cow_calf",
  	"cow_colour" varchar,
  	"cow_tag_number" varchar,
  	"cow_papers" "enum_cow_offers_cow_papers",
  	"health_dewormed" "enum_cow_offers_health_dewormed",
  	"health_notes" varchar,
  	"sale_expected_price" numeric,
  	"sale_negotiable" boolean,
  	"sale_available_from" varchar,
  	"sale_transport" "enum_cow_offers_sale_transport",
  	"sale_reason" varchar,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cow_offer_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"upload_id" varchar NOT NULL,
  	"offer_id" integer,
  	"kind" "enum_cow_offer_files_kind" NOT NULL,
  	"filename" varchar NOT NULL,
  	"mime_type" varchar NOT NULL,
  	"size" numeric NOT NULL,
  	"chunks" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cow_offer_chunks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"upload_id" varchar NOT NULL,
  	"index" numeric NOT NULL,
  	"data" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cow_offers_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cow_offer_files_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cow_offer_chunks_id" integer;
  ALTER TABLE "cow_offers_health_vaccinations" ADD CONSTRAINT "cow_offers_health_vaccinations_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cow_offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cow_offer_files" ADD CONSTRAINT "cow_offer_files_offer_id_cow_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."cow_offers"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "cow_offers_health_vaccinations_order_idx" ON "cow_offers_health_vaccinations" USING btree ("order");
  CREATE INDEX "cow_offers_health_vaccinations_parent_idx" ON "cow_offers_health_vaccinations" USING btree ("parent_id");
  CREATE INDEX "cow_offers_updated_at_idx" ON "cow_offers" USING btree ("updated_at");
  CREATE INDEX "cow_offers_created_at_idx" ON "cow_offers" USING btree ("created_at");
  CREATE UNIQUE INDEX "cow_offer_files_upload_id_idx" ON "cow_offer_files" USING btree ("upload_id");
  CREATE INDEX "cow_offer_files_offer_idx" ON "cow_offer_files" USING btree ("offer_id");
  CREATE INDEX "cow_offer_files_updated_at_idx" ON "cow_offer_files" USING btree ("updated_at");
  CREATE INDEX "cow_offer_files_created_at_idx" ON "cow_offer_files" USING btree ("created_at");
  CREATE INDEX "cow_offer_chunks_upload_id_idx" ON "cow_offer_chunks" USING btree ("upload_id");
  CREATE INDEX "cow_offer_chunks_updated_at_idx" ON "cow_offer_chunks" USING btree ("updated_at");
  CREATE INDEX "cow_offer_chunks_created_at_idx" ON "cow_offer_chunks" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cow_offers_fk" FOREIGN KEY ("cow_offers_id") REFERENCES "public"."cow_offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cow_offer_files_fk" FOREIGN KEY ("cow_offer_files_id") REFERENCES "public"."cow_offer_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cow_offer_chunks_fk" FOREIGN KEY ("cow_offer_chunks_id") REFERENCES "public"."cow_offer_chunks"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_cow_offers_id_idx" ON "payload_locked_documents_rels" USING btree ("cow_offers_id");
  CREATE INDEX "payload_locked_documents_rels_cow_offer_files_id_idx" ON "payload_locked_documents_rels" USING btree ("cow_offer_files_id");
  CREATE INDEX "payload_locked_documents_rels_cow_offer_chunks_id_idx" ON "payload_locked_documents_rels" USING btree ("cow_offer_chunks_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cow_offers_health_vaccinations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cow_offers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cow_offer_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cow_offer_chunks" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "cow_offers_health_vaccinations" CASCADE;
  DROP TABLE "cow_offers" CASCADE;
  DROP TABLE "cow_offer_files" CASCADE;
  DROP TABLE "cow_offer_chunks" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_cow_offers_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_cow_offer_files_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_cow_offer_chunks_fk";
  
  DROP INDEX "payload_locked_documents_rels_cow_offers_id_idx";
  DROP INDEX "payload_locked_documents_rels_cow_offer_files_id_idx";
  DROP INDEX "payload_locked_documents_rels_cow_offer_chunks_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "cow_offers_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "cow_offer_files_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "cow_offer_chunks_id";
  DROP TYPE "public"."enum_cow_offers_health_vaccinations";
  DROP TYPE "public"."enum_cow_offers_status";
  DROP TYPE "public"."enum_cow_offers_cow_milking_status";
  DROP TYPE "public"."enum_cow_offers_cow_pregnant";
  DROP TYPE "public"."enum_cow_offers_cow_calf";
  DROP TYPE "public"."enum_cow_offers_cow_papers";
  DROP TYPE "public"."enum_cow_offers_health_dewormed";
  DROP TYPE "public"."enum_cow_offers_sale_transport";
  DROP TYPE "public"."enum_cow_offer_files_kind";`)
}
