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

// function SignOutButton() {
//   const { isAuthenticated } = useConvexAuth();
//   const { signOut } = useAuthActions();
//   return (
//     <>
//       {isAuthenticated && (
//         <button
//           className="bg-slate-200rounded-md px-2 py-1"
//           onClick={() => void signOut()}
//         >
//           Sign out
//         </button>
//       )}
//     </>
//   );
// }


// function Content() {
//   const { viewer} = useQuery(api.myFunctions.user, {}) ?? {};
//   if (viewer === undefined) {
//     return (
//       <div className="mx-auto">
//         <p>loading... (consider a loading skeleton)</p>
//         <p>user exists </p>
//       </div>
//     );
//   }

//   return (
//     <>
//     </>
//   );
// }


