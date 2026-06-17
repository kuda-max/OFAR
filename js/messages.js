// ===== MESSAGE OPERATIONS =====
// Purpose: Load message history, handle realtime message subscription,
// and provide a helper to send new messages to the backend.

import { supabaseClient } from "./supabase.js";
import { addMessage } from "./ui.js";
import { messagesEl } from "./dom.js";

let realtimeChannel = null;

// ===== LOAD HISTORY =====
// Load message history for `currentRoom` and render each message.
// `currentUser` is used to style/identify messages that come from you.
export async function loadMessages(currentRoom, currentUser) {
  const { data, error } = await supabaseClient
    .from("messages")
    .select("*")
    .eq("room", currentRoom)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  messagesEl.innerHTML = "";
  data.forEach(msg => addMessage(msg, currentUser));
}

// ===== REALTIME SUBSCRIPTION =====

// Subscribe to realtime inserts on the messages table for `currentRoom`.
// Incoming messages are passed to `addMessage` for rendering.
export function subscribeToMessages(currentRoom, currentUser) {
  if (realtimeChannel) {
    supabaseClient.removeChannel(realtimeChannel);
  }

  realtimeChannel = supabaseClient
    .channel(`room-${currentRoom}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages"
      },
      payload => {
        const msg = payload.new;
        if (msg.room !== currentRoom) return;
        addMessage(msg, currentUser);
      }
    )
    .subscribe();
}

// ===== SEND MESSAGE =====

// Send a new message to the `messages` table. Trims text and ignores empty.
export async function sendMessage(messageText, currentUser, currentRoom) {
  const text = messageText.trim();
  if (!text) return;

  const { error } = await supabaseClient
    .from("messages")
    .insert({
      username: currentUser,
      avatar: "😎",
      room: currentRoom,
      message: text
    });

  if (error) {
    console.error(error);
    return;
  }
}

// ===== CLEANUP =====

// Remove the realtime subscription and clear the channel reference.
export function unsubscribeFromMessages() {
  if (realtimeChannel) {
    supabaseClient.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }
}
