// ===== MAIN APP =====
// Purpose: Wire up main UI controls and bootstrap the chat app.
// - Restores saved sessions
// - Hooks DOM events for join/send/leave
// - Delegates auth, messaging and storage to other modules
import { toggleSidebar } from "./ui.js";
import { 
  joinBtn, sendBtn, messageInput, usernameInput, roomInput, leaveBtn 
} from "./dom.js";
import { joinChat, leaveChat } from "./auth.js";
import { sendMessage } from "./messages.js";
import { getSavedUsername, getSavedRoom } from "./storage.js";

let currentUser = null;
let currentRoom = "general";

// ===== INIT =====

// Initialize app state on page load. If a saved username exists,
// restore the session and join the previously used room.
function initApp() {
  // Check for saved session
  const savedUsername = getSavedUsername();
  
  if (savedUsername) {
    const savedRoom = getSavedRoom() || "general";
    currentUser = savedUsername;
    currentRoom = savedRoom;
    joinChat(savedUsername, savedRoom);
  }
}

// ===== EVENT LISTENERS =====

joinBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const room = roomInput.value.trim().toLowerCase() || "general";

  if (await joinChat(username, room)) {
    currentUser = username;
    currentRoom = room;
  }
});

usernameInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    joinBtn.click();
  }
});

sendBtn.addEventListener("click", async () => {

  const text =
    messageInput.value.trim();

  const file =
    fileInput.files[0];

  if (!text && !file) return;

  if (currentUser) {

    await sendMessage(
      text,
      currentUser,
      currentRoom,
      file
    );

    messageInput.value = "";

    fileInput.value = "";
  }

});

messageInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});

leaveBtn.addEventListener("click", async () => {
  const confirmed = confirm("Leave chat?");
  if (!confirmed) return;

  await leaveChat(currentUser);
  currentUser = null;
  currentRoom = "general";
});

//select and send the images 
attachBtn.addEventListener(
  "click",
  () => {
    fileInput.click();
  }
);

// ===== START APP =====


initApp();



menuBtn.addEventListener("click", toggleSidebar);
closeMenuBtn.addEventListener("click", toggleSidebar);