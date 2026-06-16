// ===== PRESENCE TRACKING =====

import { supabaseClient } from "./supabase.js";
import { displayOnlineUsers, updateOnlineCount } from "./ui.js";

// ===== UPDATE PRESENCE =====

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

export async function removeFromPresence(currentUser) {
  if (!currentUser) return;

  await supabaseClient
    .from("online_users")
    .delete()
    .eq("username", currentUser);
}

//removed logs