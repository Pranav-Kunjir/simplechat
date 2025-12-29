"use client";

import {
  Authenticated,
  Unauthenticated,
} from "convex/react";
// import { useState } from "react";
import { SignIn } from "./signin";
import {ChatSidebar} from "./chatSidebar";
import "./index.css"





export default function App() {
  return (
    <>
      <main className="main-content">
      <link rel="icon" href="/favicon.png" sizes="any" />
      <title>Simple Chat App</title>
        <Authenticated>
          <ChatSidebar/>
        </Authenticated>
        <Unauthenticated>
          <SignIn/>
        </Unauthenticated>
      </main>
    </>
  );
}
