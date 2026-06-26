CREATE TYPE "public"."application_status" AS ENUM('draft', 'submitted', 'reviewing', 'processing', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."entry_type" AS ENUM('single', 'multiple');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'succeeded', 'failed');--> statement-breakpoint
CREATE TYPE "public"."processing_tier" AS ENUM('standard', 'express');--> statement-breakpoint
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
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" varchar(20) PRIMARY KEY NOT NULL,
	"visa_type_id" integer NOT NULL,
	"nationality" varchar(100) NOT NULL,
	"given_name" varchar(200) NOT NULL,
	"surname" varchar(200) NOT NULL,
	"passport_number" varchar(50) NOT NULL,
	"date_of_birth" varchar(10) NOT NULL,
	"passport_expiry" varchar(10) NOT NULL,
	"travel_date" varchar(10) NOT NULL,
	"applicant_email" varchar(255),
	"processing_tier" "processing_tier" DEFAULT 'standard' NOT NULL,
	"status" "application_status" DEFAULT 'draft' NOT NULL,
	"stripe_payment_intent_id" varchar(100),
	"amount_paid_aed" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" varchar(20) NOT NULL,
	"document_type" varchar(100) NOT NULL,
	"r2_key" varchar(500) NOT NULL,
	"filename" varchar(255) NOT NULL,
	"size_bytes" integer NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"subject" varchar(300) NOT NULL,
	"message" text NOT NULL,
	"resolved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" varchar(20) NOT NULL,
	"stripe_payment_intent_id" varchar(100) NOT NULL,
	"amount_aed" integer NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "status_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" varchar(20) NOT NULL,
	"status" "application_status" NOT NULL,
	"note" text,
	"changed_by_admin_id" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'consultant' NOT NULL,
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
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "visa_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	"entry_type" "entry_type" NOT NULL,
	"duration_days" integer NOT NULL,
	"standard_price_aed" integer NOT NULL,
	"has_express" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "visa_types_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_visa_type_id_visa_types_id_fk" FOREIGN KEY ("visa_type_id") REFERENCES "public"."visa_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_history" ADD CONSTRAINT "status_history_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;