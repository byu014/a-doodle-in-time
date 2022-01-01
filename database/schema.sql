set client_min_messages to warning;
-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;
create schema "public";

CREATE TABLE "users" (
	"userId" serial NOT NULL,
	"username" TEXT NOT NULL UNIQUE,
	"hashedPassword" TEXT NOT NULL,
	"email" TEXT,
	"location" TEXT,
	"bio" TEXT,
	"pfpUrl" TEXT DEFAULT 'https://res.cloudinary.com/dowvcrx9e/image/upload/v1640925526/DrawingApp/default.png',
	"joined" timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "doodles" (
	"doodleId" serial NOT NULL,
	"userId" integer NOT NULL,
	"title" TEXT NOT NULL,
	"caption" TEXT NOT NULL,
	"dataUrl" TEXT NOT NULL,
	"createdAt" timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT "doodles_pk" PRIMARY KEY ("doodleId")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "favorites" (
	"userId" integer NOT NULL,
	"doodleId" integer NOT NULL,
	"favoritedAt" timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT "favorites_pk" PRIMARY KEY ("userId","doodleId")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "likes" (
	"userId" integer NOT NULL,
	"doodleId" integer NOT NULL,
	"likedAt" timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT "likes_pk" PRIMARY KEY ("userId","doodleId")
) WITH (
  OIDS=FALSE
);
ALTER TABLE "doodles" ADD CONSTRAINT "doodles_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_fk1" FOREIGN KEY ("doodleId") REFERENCES "doodles"("doodleId");
ALTER TABLE "likes" ADD CONSTRAINT "likes_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "likes" ADD CONSTRAINT "likes_fk1" FOREIGN KEY ("doodleId") REFERENCES "doodles"("doodleId");
