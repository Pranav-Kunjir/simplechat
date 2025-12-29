"use client";

import {
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
import { UserMessages } from "./messages";
import { useAuthActions } from "@convex-dev/auth/react";
import { FiMail, FiSearch, FiPlus } from 'react-icons/fi';
import Dropdown from 'react-bootstrap/Dropdown';

export function ChatSidebar() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [currChat, setCurrChat] = useState("");
  const [searchEmail, setSearchEmail] = useState<string | null>(null);
  currChat;
  // Proper query skipping with null arguments
  const userExists = useQuery(
    api.myFunctions.searchUser,
    searchEmail ? { email: searchEmail } : "skip"
  );

  // Assuming the user query returns image as well. If not, we'll need to check the schema or api.
  // Based on userExists usage, it seems 'image' is the field name. 
  const userInfo: any = useQuery(api.myFunctions.user, {}) ?? {};
  const viewer = userInfo.viewer;
  const viewerName = userInfo.viewerName;
  const viewerImage = userInfo.viewerImage;

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
    if (setEmail !== undefined) {
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
  // Sidebar resizing state
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      // Limit sidebar width between 200px and 500px
      const newWidth = Math.min(Math.max(e.clientX, 200), 500);
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const startResizing = () => {
    setIsResizing(true);
  };

  let allUserChat = useQuery(api.myFunctions.renderChats, { email: viewer ?? "" })
  // console.log(allUserChat)

  const activeChat = allUserChat?.find((c) => c?._id === currChat);
  const recipientName = activeChat
    ? (activeChat.memeberName1 !== viewerName ? activeChat.memeberName1 : activeChat.memeberName2)
    : "Chat";

  return (
    <div
      className={`main-container ${currChat ? 'mobile-chat-active' : ''}`}
      style={{ gridTemplateColumns: `${sidebarWidth}px 5px 1fr` }}
    >
      <div className="chat-sidebar" style={{ width: "100%" }}>
        <div className="sidebar-header p-3">
          <Button
            variant="primary"
            onClick={() => setShow(true)}
            className="w-100 add-friend-btn d-flex align-items-center justify-content-center gap-2"
          >
            <FiPlus />
            <span>Add a Friend</span>
          </Button>
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

        <div className="chat-list">
          {allUserChat?.map((chat) => (
            <div
              key={chat?._id}
              data-chat-id={chat?._id}
              className={`chats ${currChat === chat?._id ? 'active-chat' : ''}`}
              onClick={(e) => {
                // Extract _id from dataset
                const chatId = e.currentTarget.dataset.chatId;
                setCurrChat(chatId ?? "")
              }}
            >
              {chat?.memeberName1 !== viewerName ? <p>{chat?.memeberName1}</p> : <p>{chat?.memeberName2}</p>}
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          {isAuthenticated && (
            <Dropdown drop="up">
              <Dropdown.Toggle as="div" className="profile-dropdown-toggle">
                <img
                  src={viewerImage || "https://placehold.co/48x48?text=U"}
                  alt="Profile"
                  className="userAvatarImage" // Reusing this class for circular style
                  style={{ width: '40px', height: '40px', border: 'none', cursor: 'pointer' }}
                />
                <span className="profile-name">{viewerName}</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="profile-menu">
                <Dropdown.Item href="#/settings">Settings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => void signOut()} className="text-danger">
                  Log out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>
      <div
        className="resizer-handle"
        onMouseDown={startResizing}
      />
      <div className="message-container">
        <UserMessages
          chatId={currChat}
          onBack={() => setCurrChat("")}
          recipientName={recipientName ?? "Chat"}
        />
      </div>
    </div>

  );
}


