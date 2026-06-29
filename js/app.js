// ===== MAIN APP =====
// Purpose: Wire up main UI controls and bootstrap the chat app.
// - Restores saved sessions
// - Hooks DOM events for join/send/leave
// - Delegates auth, messaging and storage to other modules
import { toggleSidebar } from "./ui.js";
import { 
  joinBtn, sendBtn, messageInput, usernameInput, roomInput, leaveBtn, lightbox ,uploadStatus
} from "./dom.js";
import { joinChat, leaveChat } from "./auth.js";
import { sendMessage } from "./messages.js";
import { getSavedUsername, getSavedRoom } from "./storage.js";
import {
  replyingTo,
  setReplyingTo
} from "./state.js";
import {
  updateTyping
} from "./presence.js";

let currentUser = null;
let currentRoom = "general";

// ===== INIT =====

// Initialize app state on page load. If a saved username exists,
// restore the session and join the previously used room.
function initApp() {

    if (
    "Notification" in window &&
    Notification.permission ===
      "default"
  ) {

    Notification
      .requestPermission();

  }

  // Check for saved session
  const savedUsername =
    getSavedUsername();

  
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

  try {

    sendBtn.disabled = true;

    if (file) {

      uploadStatus.textContent =
        `Uploading ${file.name}...`;

    } else {

      uploadStatus.textContent =
        "Sending message...";
    }

    if (currentUser) {
      await sendMessage(
        text,
        currentUser,
        currentRoom,
        file,
        replyingTo?.id
      );

      messageInput.value = "";

      fileInput.value = "";

      setReplyingTo(null);

      document.getElementById(
          "replyPreview"
        )
        ?.remove();
    }

    uploadStatus.textContent =
      "✅ Sent";

    setTimeout(() => {

      uploadStatus.textContent = "";

    }, 1500);

  } catch (error) {

    console.error(error);

    uploadStatus.textContent =
      "❌ Upload failed";

    setTimeout(() => {

      uploadStatus.textContent = "";

    }, 3000);

  } finally {

    sendBtn.disabled = false;

  }

});

messageInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});
messageInput.addEventListener(
  "input",
  () => {

    console.log("Typing detected");

    if (
      currentUser &&
      currentRoom
    ) {

      updateTyping(
        currentUser,
        currentRoom
      );

    }

  }
);

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

//close lightbox when clicking outside the image

window.closeLightbox = function () {
    lightbox.classList.add("hidden");
};

//download the image when clicking the download button in the lightbox
const downloadBtn =
    document.getElementById("lightboxDownload");

downloadBtn.addEventListener(
    "click",
    async (e) => {

        e.preventDefault();
        e.stopPropagation();

        try {

            const response =
                await fetch(downloadBtn.href);

            const blob =
                await response.blob();

            const url =
                URL.createObjectURL(blob);

            const a =
                document.createElement("a");

            a.href = url;

            a.download = "image";

            document.body.appendChild(a);

            a.click();

            a.remove();

            URL.revokeObjectURL(url);

        } catch (err) {

            console.error(
                "Download failed:",
                err
            );
        }
    }
);
// ===== START APP =====


initApp();



menuBtn.addEventListener("click", toggleSidebar);
closeMenuBtn.addEventListener("click", toggleSidebar);