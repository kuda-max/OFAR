// ===== MESSAGE OPERATIONS =====
// Purpose: Load message history, handle realtime message subscription,
// and provide a helper to send new messages to the backend.
import { uploadImage } from "./uploads.js";
import { supabaseClient } from "./supabase.js";
import { addMessage, addDateSeparator, addNewMessagesDivider} from "./ui.js";
import { messagesEl } from "./dom.js";

let realtimeChannel = null;

// ===== LOAD HISTORY =====
// Load message history for `currentRoom` and render each message.
// `currentUser` is used to style/identify messages that come from you.
export async function loadMessages(
  currentRoom,
  currentUser,
  lastSeen
) {


  let newMessagesDividerAdded =false;
  const { data, error } =
    await supabaseClient
      .from("messages")
      .select("*")
      .eq("room", currentRoom)
      .order(
        "created_at",
        { ascending: true }
      );

  if (error) {

    console.error(error);

    return;
  }

  messagesEl.innerHTML = "";

  let lastDate = null;

  data.forEach(msg => {

    const messageDate =
      new Date(
        msg.created_at
      ).toDateString();

    if (
      messageDate !==
      lastDate
    ) {

      let label =
        messageDate;

      const today =
        new Date()
          .toDateString();

      const yesterday =
        new Date(
          Date.now() -
          86400000
        ).toDateString();

      if (
        messageDate ===
        today
      ) {

        label = "Today";

      }

      else if (
        messageDate ===
        yesterday
      ) {

        label = "Yesterday";

      }

      addDateSeparator(
        label
      );

      lastDate =
        messageDate;
    }

    if (
  lastSeen &&
  !newMessagesDividerAdded &&
  new Date(msg.created_at) >
    new Date(lastSeen)
) {

  addNewMessagesDivider();

  newMessagesDividerAdded =
    true;
}

    addMessage(
      msg,
      currentUser
    );

  });

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

  const msg =
    payload.new;

  if (
    msg.room !==
    currentRoom
  ) return;

  addMessage(
    msg,
    currentUser
  );

  if (
    msg.username !==
      currentUser &&
    document.hidden &&
    Notification.permission ===
      "granted"
  ) {

    new Notification(
      msg.username,
      {
        body:
          msg.message ||
           `📎 ${msg.file_name}`,
        icon:
          "/icon-192.png"
      }
    );

  }

}
    )
    .subscribe();
}

// ===== SEND MESSAGE =====

// Send a new message to the `messages` table. Trims text and ignores empty.
export async function sendMessage(
  messageText,
  currentUser,
  currentRoom,
  file
) {

  const text = messageText.trim();

  if (!text && !file) return;

  let fileUrl = null;
  let fileName = null;
  let fileType = null;

  if (file) {

    fileUrl = await uploadImage(file);

    fileName = file.name;

    fileType = file.type;
  }

  const { error } = await supabaseClient
    .from("messages")
    .insert({
      username: currentUser,
      avatar: "😎",
      room: currentRoom,
      message: text,
      file_url: fileUrl,
      file_name: fileName,
      file_type: fileType
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
