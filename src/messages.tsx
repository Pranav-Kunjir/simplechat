"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import 'bootstrap/dist/css/bootstrap.css';
import "./index.css"
import { setDefaultAutoSelectFamily } from "net";


function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    
    // Time components
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const twelveHour = hours % 12 || 12; // Convert 0-23 to 12,1-11

    // Date components
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${twelveHour}:${minutes} ${ampm} `;
}


export function UserMessages({ chatId }: { chatId: string }) {
    const { viewer } = useQuery(api.myFunctions.user, {}) ?? {};
    const msgs = useQuery(api.myFunctions.getMessages, { chatId: chatId });
    const sendMessage = useMutation(api.myFunctions.writeMessages);
    const [message, setMessage] = useState("");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (message.trim()) { // Check for non-empty message
            sendMessage({
                chatId: chatId,
                senderId: viewer ?? "",
                text: message,
                createdAt: Date.now(),
            });
            setMessage(""); // Clear the input field
        }
    };
    return (
        <>
            <div className="messages-container">
                {msgs?.map((individualMsg) => (
                    <div key={individualMsg._id} className="user-chats"  
                    style={{ 
                        backgroundColor: individualMsg.senderId === viewer ? '#005c4b' : '#363636',
                      }}>
                        <h5 className="user-msg">{individualMsg.text}</h5>
                        <p>{formatTimestamp(individualMsg.createdAt)}</p>
                    </div>
                ))}
            </div>
            <Form onSubmit={handleSubmit}>
                <InputGroup className="mb-3">
                    <Form.Control
                        value={message} // Make it a controlled input
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message"
                        aria-label="Message input"
                    />
                    <Button 
                        variant="outline-secondary" 
                        type="submit" 
                        id="button-addon2"
                    >
                        Send
                    </Button>
                </InputGroup>
            </Form>
        </>
    );
}