// ===== MESSAGE OPERATIONS =====

import { supabaseClient } from "./supabase.js";
import { addMessage } from "./ui.js";
import { messagesEl } from "./dom.js";

let realtimeChannel = null;

// ===== LOAD HISTORY =====

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

export function unsubscribeFromMessages() {
  if (realtimeChannel) {
    supabaseClient.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }
}
