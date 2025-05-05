import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Email } from "@convex-dev/auth/providers/Email";
import { useMutation } from "convex/react";


// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.




// You can read data from the database via a query:
export const user = query({
  handler: async (ctx, args) => {
    //// Read the database as many times as you need here.
    //// See https://docs.convex.dev/database/reading-data.
    const userId = await getAuthUserId(ctx);
    const user = userId === null ? null : await ctx.db.get(userId);
    return {
      viewer: user?._id ?? null,
      viewerName: user?.name ?? null,
      viewerImage: user?.image ?? null,
      viewerEmail: user?.email ?? null,
    };
  },
});

// export const lastMsgUpdate = mutation({
//   args: {updateTime: v.number()},
//   handler: async (ctx, args) =>{

//   }
// })


export const createChat = mutation({
    args: { 
      member1: v.string(),
      member2: v.string(),
      memeberName1 : v.string(),
    memeberName2 : v.string(),
      createdAt: v.number()},
    handler: async (ctx, args) => { 
      return ctx.db.insert("chats", {
        member1: args.member1,
        member2: args.member2,
        memeberName1 : args.memeberName1,
         memeberName2 : args.memeberName2,
        createdAt: Date.now(),
      })
    }
  })



export const renderChats = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx , args) =>{
    // const chats = ctx.db
    //   .query("chats")
    //   .withIndex("by_member1", (q) => q.eq("member1", args.email))
    //   .collect()
    // return chats
    const chatsAsMember1 = await ctx.db
    .query("chats")
    .withIndex("by_member1", q => q.eq("member1", args.email))
    .collect();

  const chatsAsMember2 = await ctx.db
    .query("chats")
    .withIndex("by_member2", q => q.eq("member2", args.email))
    .collect();

    // 3. Combine and deduplicate
    const allChats = [...chatsAsMember1, ...chatsAsMember2];
    const uniqueChats = Array.from(new Set(allChats.map(chat => chat._id)))
      .map(id => allChats.find(chat => chat._id === id));
    return uniqueChats;
  },
});





export const searchUser = query({
  args: {email : v.string()},
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").filter((q) => q.eq(q.field("email"), args.email)).first();
    return user
  }
});


export const getMessages = query({
  args : {chatId : v.string()},
  handler: async(ctx, args) =>{
    const mesages = await ctx.db
    .query("messages")
    .withIndex("by_chat", q=> q.eq("chatId", args.chatId))
    .order("asc")
    .collect()
    return mesages
  }
})


export const writeMessages = mutation({
  args : {
    chatId: v.string(),
    senderId: v.string(),
    text: v.string(),
    createdAt: v.number(),
  },
  handler: async(ctx,args) =>{
    return ctx.db.insert("messages", {
      chatId: args.chatId,
      senderId: args.senderId,
      text: args.text,
      createdAt: Date.now(),
    })
  }
})