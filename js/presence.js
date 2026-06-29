// ===== PRESENCE TRACKING =====
// Purpose: Track which users are online in a room.
// - `updatePresence` writes/updates a heartbeat timestamp
// - `loadOnlineUsers` reads recently-seen users for a room
// - `removeFromPresence` deletes a user's presence on leave

import { supabaseClient } from "./supabase.js";
import { displayOnlineUsers, updateOnlineCount } from "./ui.js";

export async function updateTyping(
  currentUser,
  currentRoom
) {

  console.log(
    "Updating typing:",
    currentUser,
    currentRoom
  );

const { data, error } =
  await supabaseClient
    .from("typing_status")
    .upsert({
      username: currentUser,
      room: currentRoom,
      is_typing: true,
      updated_at:
        new Date().toISOString()
    })
    .select();

console.log(
  "Returned row:",
  data
);

console.log(
  "Error:",
  error
);
  console.log(data);
  console.log(error);

}

// ===== UPDATE PRESENCE =====

// Write or update the current user's last_seen timestamp for the room.
export async function updatePresence(currentUser, currentRoom) {
  if (!currentUser) return;

  await supabaseClient
    .from("online_users")
    .upsert({
      username: currentUser,
      room: currentRoom,
      last_seen: new Date().toISOString()
    });
}

// ===== LOAD ONLINE USERS =====

// Load users who have been seen within the last 30 seconds for `currentRoom`.
// Calls UI helpers to display the list and update the count badge.
export async function loadOnlineUsers(currentRoom) {
  const cutoff = new Date(
    Date.now() - 30000
  ).toISOString();

  const { data, error } = await supabaseClient
    .from("online_users")
    .select("*")
    .eq("room", currentRoom)
    .gte("last_seen", cutoff);

  if (error) {
    console.error(error);
    return;
  }

  displayOnlineUsers(data);
  updateOnlineCount(data.length);
}

// ===== REMOVE FROM PRESENCE =====

// Remove the user's presence record when they leave the chat.
export async function removeFromPresence(currentUser) {
  if (!currentUser) return;

  await supabaseClient
    .from("online_users")
    .delete()
    .eq("username", currentUser);
}

// removed logs