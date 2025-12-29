"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState, useRef, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import 'bootstrap/dist/css/bootstrap.css';
import "./index.css"



function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);

    // Time components
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const twelveHour = hours % 12 || 12; // Convert 0-23 to 12,1-11

    // Date components
    // const day = date.getDate().toString().padStart(2, '0');
    // const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    // const year = date.getFullYear();
    return `${twelveHour}:${minutes} ${ampm} `;
}


import { FiArrowLeft } from 'react-icons/fi';

export function UserMessages({ chatId, onBack, recipientName }: { chatId: string, onBack: () => void, recipientName: string }) {
    const { viewer } = useQuery(api.myFunctions.user, {}) ?? {};
    const msgs = useQuery(api.myFunctions.getMessages, { chatId: chatId });
    const sendMessage = useMutation(api.myFunctions.writeMessages);
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [msgs]);

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
            <div className="chat-header mobile-visible">
                <Button variant="link" className="back-btn text-white p-0 me-3" onClick={onBack}>
                    <FiArrowLeft size={24} />
                </Button>
                <h5 className="m-0 text-white">{recipientName}</h5>
            </div>
            <div className="messages-container">
                {msgs?.map((individualMsg) => (
                    <div
                        key={individualMsg._id}
                        className={`message-bubble ${individualMsg.senderId === viewer ? 'message-sent' : 'message-received'}`}
                    >
                        <h5 className="user-msg">{individualMsg.text}</h5>
                        <p className="message-time">{formatTimestamp(individualMsg.createdAt)}</p>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <Form onSubmit={handleSubmit}>
                <InputGroup className="mb-0 chat-input-group">
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