// ===== DOM ELEMENTS =====
// Purpose: Centralized references to DOM nodes used across the app.
// Exporting these makes it easy for other modules to read/update the UI
// without repeatedly querying the document.

// Screens
export const joinScreen = document.getElementById("joinScreen");
export const chatScreen = document.getElementById("chatScreen");

// Join form
export const usernameInput = document.getElementById("usernameInput");
export const roomInput = document.getElementById("roomInput");
export const joinBtn = document.getElementById("joinBtn");

// Chat header
export const roomDisplay = document.getElementById("roomDisplay");

// Messages
export const messagesEl = document.getElementById("messages");
export const messagesContainer = document.getElementById("messagesContainer");

// Message input
export const messageInput = document.getElementById("messageInput");
export const sendBtn = document.getElementById("sendBtn");

// Online users
export const onlineUsersEl = document.getElementById("onlineUsers");
export const membersList = document.getElementById("membersList");
export const mobileMembersList = document.getElementById("mobileMembersList");
export const leaveBtn = document.getElementById("leaveBtn");

//images
export const fileInput = document.getElementById("fileInput");
export const attachBtn = document.getElementById("attachBtn");
export const lightbox =
    document.getElementById("lightbox");

export const uploadStatus =
    document.getElementById("uploadStatus");