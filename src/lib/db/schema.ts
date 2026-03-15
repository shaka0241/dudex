import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
			
export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("emailVerified").notNull(),
    image: text("image"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull()
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId").notNull().references(() => user.id)
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId").notNull().references(() => user.id),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull()
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt"),
    updatedAt: timestamp("updatedAt")
});

export const client = pgTable("client", {
    id: text("id").primaryKey(), // We can use crypto.randomUUID() when inserting
    nationalIdHash: text("nationalIdHash").notNull().unique(), // The hashed Cedula/DNI
    name: text("name"), // Optional reference name
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const report = pgTable("report", {
    id: text("id").primaryKey(), // crypto.randomUUID()
    clientId: text("clientId").notNull().references(() => client.id, { onDelete: 'cascade' }),
    merchantId: text("merchantId").notNull().references(() => user.id, { onDelete: 'cascade' }),
    status: text("status", { enum: ['POSITIVE', 'WARNING', 'DANGER'] }).notNull(),
    amount: text("amount"), // Optional amount (string to avoid float issues, or could be numeric)
    description: text("description").notNull(),
    resolvedAt: timestamp("resolvedAt"), // Null if not resolved
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
