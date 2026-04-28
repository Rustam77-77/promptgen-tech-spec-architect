import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
const applicationTables = {
  files: defineTable({
    userId: v.id("users"),
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(),
    description: v.optional(v.string()),
    uploadedAt: v.number(),
  })
    .index("by_userId_uploadedAt", ["userId", "uploadedAt"])
    .index("by_userId_storageId", ["userId", "storageId"]),
  chatThreads: defineTable({
    userId: v.id("users"),
    title: v.string(),
    systemPrompt: v.string(),
    model: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_updatedAt", ["userId", "updatedAt"]),
  chatMessages: defineTable({
    threadId: v.id("chatThreads"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_threadId", ["threadId"])
    .index("by_threadId_createdAt", ["threadId", "createdAt"]),
  savedPrompts: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    appType: v.string(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_createdAt", ["userId", "createdAt"]),
  promptTemplates: defineTable({
    title: v.string(),
    description: v.string(),
    presetData: v.string(), // JSON string of the form state
    category: v.string(),
  }).index("by_category", ["category"]),
};
export default defineSchema({
  ...authTables,
  ...applicationTables,
});