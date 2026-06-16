// ===== AUTHENTICATION =====

import { supabaseClient } from "./supabase.js";
import { 
  joinScreen, chatScreen, messagesEl, usernameInput, roomDisplay 
} from "./dom.js";
import { 
  loadMessages, subscribeToMessages, unsubscribeFromMessages 
} from "./messages.js";
import { 
  updatePresence, loadOnlineUsers, removeFromPresence 
} from "./presence.js";
import { 
  saveUsername, saveRoom, clearAll 
} from "./storage.js";

let presenceInterval = null;
let usersInterval = null;

// ===== JOIN CHAT =====

export async function joinChat(username, room) {
  if (!username) {
    alert("Enter a username");
    return false;
  }

  // Save user + room
  saveUsername(username);
  saveRoom(room);

  roomDisplay.textContent = room;

  // Show chat
  joinScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");
  chatScreen.classList.add("flex");

  // Load messages
  await loadMessages(room, username);

  // Start realtime
  subscribeToMessages(room, username);

  // Add self to online users
  await updatePresence(username, room);

  // Load online users list
  await loadOnlineUsers(room);

  // Prevent duplicate intervals
  if (presenceInterval) {
    clearInterval(presenceInterval);
  }

  if (usersInterval) {
    clearInterval(usersInterval);
  }

  // Presence heartbeat
  presenceInterval = setInterval(() => {
    updatePresence(username, room);
  }, 15000);

  // Refresh online users
  usersInterval = setInterval(() => {
    loadOnlineUsers(room);
  }, 5000);

  return true;
}

// ===== LEAVE CHAT =====

export async function leaveChat(currentUser) {
  if (currentUser) {
    await removeFromPresence(currentUser);
  }

  clearAll();

  if (presenceInterval) {
    clearInterval(presenceInterval);
  }

  if (usersInterval) {
    clearInterval(usersInterval);
  }

  unsubscribeFromMessages();

  chatScreen.classList.add("hidden");
  joinScreen.classList.remove("hidden");

  messagesEl.innerHTML = "";
  usernameInput.value = "";
}
