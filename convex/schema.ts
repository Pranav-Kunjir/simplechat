import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import { user } from "./myFunctions";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  // numbers: defineTable({
  //   value: v.number(),
  // }),
  chats: defineTable({
    // chatmemeber: v.array(v.id("users")), // userIds
    member1 : v.string(),
    member2 : v.string(),
    memeberName1 : v.string(),
    memeberName2 : v.string(),
    createdAt: v.number()
  })  
  .index("by_member1", ['member1'])
  .index("by_member2", ['member2']),
  messages: defineTable({
    chatId: v.string(),
    senderId: v.string(),
    text: v.string(),
    createdAt: v.number(),
  }).index("by_chat", ["chatId"])
});
