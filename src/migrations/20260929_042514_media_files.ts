import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "media_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"filename" varchar NOT NULL,
  	"mime_type" varchar,
  	"data" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "media_files_id" integer;
  CREATE UNIQUE INDEX "media_files_filename_idx" ON "media_files" USING btree ("filename");
  CREATE INDEX "media_files_updated_at_idx" ON "media_files" USING btree ("updated_at");
  CREATE INDEX "media_files_created_at_idx" ON "media_files" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_files_fk" FOREIGN KEY ("media_files_id") REFERENCES "public"."media_files"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_media_files_id_idx" ON "payload_locked_documents_rels" USING btree ("media_files_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media_files" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "media_files" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_media_files_fk";
  
  DROP INDEX "payload_locked_documents_rels_media_files_id_idx";
  ALTER TABLE "media" DROP COLUMN "_objectkey";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "media_files_id";`)
}
