"use client";

import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
} from "convex/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.css';
import "./index.css"
import { eventNames } from "process";
import { user } from "../convex/myFunctions";
import { UserMessages } from "./messages";
import { useAuthActions } from "@convex-dev/auth/react";
import { FiMail, FiSearch, FiUser } from 'react-icons/fi';



export function ChatSidebar() {
    const { isAuthenticated } = useConvexAuth();
    const { signOut } = useAuthActions();

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [currChat, setCurrChat] = useState("");
  const [searchEmail, setSearchEmail] = useState<string | null>(null);
  const [selected, setSelected] = useState(false);
  currChat;
  // Proper query skipping with null arguments
  const userExists = useQuery(
    api.myFunctions.searchUser,
    searchEmail ? { email: searchEmail } : "skip"
  );

  const { viewer, viewerName} = useQuery(api.myFunctions.user, {}) ?? {};
  const addUserToChat = useMutation(api.myFunctions.createChat);  
  
  useEffect(() => {
    if (userExists !== undefined) {
      // console.log("User exists:", userExists);
    }
  }, [userExists]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSearchEmail(email);
  };
  const handleAddUserToChat = (event: React.FormEvent) => {
    event?.preventDefault()
    if( setEmail !== undefined){
      addUserToChat({
        member1: viewer ?? "",
        member2: userExists?._id ?? "",
        memeberName1: userExists?.name ?? "",
        memeberName2: viewerName ?? "",
        createdAt: Date.now()
      })
      
    }
  }
  const handleClose = () => {
    setShow(false);
    setSearchEmail(null); // Reset search when closing
  };
  let allUserChat = useQuery(api.myFunctions.renderChats, { email: viewer ?? "" })
  // console.log(allUserChat)
  return (
    <div  className="main-container">
     <div className="chat-sidebar">
     <div className="btn">
     <Button variant="primary" onClick={() => setShow(true)}>
        Add a Friend
      </Button>
      {isAuthenticated && (
        <Button
          variant="primary"
          onClick={() => void signOut()}
        >
          Sign out
        </Button>
      )}
     </div>
    
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>User Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleSubmit} className="email-search-form">
          <Form.Group controlId="emailInput">
          <div className="form-header">
            <FiMail className="form-icon" />
            <h3>Find User by Email</h3>
          </div>
          <div className="input-group">
            <Form.Control
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="name@example.com"
              autoFocus
              className="email-input"
            />
            <Button type="submit" className="search-button">
              <FiSearch className="button-icon" />
              Search
            </Button>
          </div>
          <p className="form-hint">Enter the email address to find the user</p>
        </Form.Group>
      </Form>       
          <Form onSubmit={handleAddUserToChat}>
          {userExists !== undefined && (
            <div className="userExistsContainer">
              <img 
                src={userExists?.image} 
                alt="avatar" 
                className="userAvatarImage"  
                referrerPolicy="no-referrer"
              />
              <div className="userInfo">
                <p className="userName">{userExists?.name}</p>
                <p className="userStatus">Available to chat</p>
              </div>
              <button type="submit" className="addUserButton">
                <span>Add to Chat</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
              </button>
            </div>
          )}
        </Form>
        </Modal.Body>
      </Modal>
      {allUserChat?.map((chat) =>(
        <div  key={chat?._id} data-chat-id={chat?._id}   className="chats"   onClick={(e) => {
          // Extract _id from dataset
          const chatId = e.currentTarget.dataset.chatId;
          setSelected(true)
          setCurrChat(chatId ?? "")
        }} style={{ 
          backgroundColor: currChat === chat?._id ? '#515151' : '#2c2c2c',
        }}>
          {chat?.memeberName1 !== viewerName ? <p>{chat?.memeberName1}</p> : <p>{chat?.memeberName2}</p>}
      </div>
      ))}
     </div>
     <div className="message-container">
      <UserMessages chatId={currChat} />
     </div>
    </div>
    
  );
}


