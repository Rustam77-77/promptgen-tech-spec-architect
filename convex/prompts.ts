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
    if (!userId) throw new Error("Unauthorized");
    return await ctx.db.insert("savedPrompts", {
      userId,
      ...args,
      createdAt: Date.now(),
    });
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
// Internal mutation to seed templates if needed
export const seedTemplates = internalMutation({
  args: {
    templates: v.array(
      v.object({
        title: v.string(),
        description: v.string(),
        presetData: v.string(),
        category: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const t of args.templates) {
      await ctx.db.insert("promptTemplates", t);
    }
  },
});