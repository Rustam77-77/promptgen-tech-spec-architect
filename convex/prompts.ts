import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
export const savePrompt = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    appType: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      console.error("[savePrompt] Unauthorized access attempt");
      throw new Error("Unauthorized");
    }
    // Sanitize and validate inputs
    const sanitizedTitle = args.title.trim() || "Untitled Prompt";
    const sanitizedContent = args.content.trim();
    const cleanTags = args.tags.map(t => t.trim()).filter(t => t.length > 0);
    const sanitizedAppType = args.appType.trim() || "General";
    if (!sanitizedContent) {
      console.error("[savePrompt] Attempted to save empty content");
      throw new Error("Prompt content cannot be empty");
    }
    try {
      return await ctx.db.insert("savedPrompts", {
        userId,
        title: sanitizedTitle,
        content: sanitizedContent,
        tags: cleanTags,
        appType: sanitizedAppType,
        createdAt: Date.now(),
      });
    } catch (error) {
      console.error("[savePrompt] Server Error during insert:", error);
      throw new Error("Failed to save prompt to database");
    }
  },
});
export const listSavedPrompts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("savedPrompts")
      .withIndex("by_userId_createdAt", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});
export const deletePrompt = mutation({
  args: { id: v.id("savedPrompts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const prompt = await ctx.db.get(args.id);
    if (!prompt || prompt.userId !== userId) throw new Error("Forbidden");
    await ctx.db.delete(args.id);
  },
});
export const listTemplates = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("promptTemplates").collect();
  },
});