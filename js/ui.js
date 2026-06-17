// ===== UI HELPERS =====
// Purpose: Small, reusable DOM helper functions for rendering messages
// and online user lists. These keep rendering logic separate from
// data and network code.

import { messagesEl, messagesContainer, membersList, mobileMembersList} from "./dom.js";
let imageurltodownload = "";
// Ensure the messages container is scrolled to show the latest message.
export function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Format an ISO timestamp into a localized short time string.
export function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

// ===== MESSAGE UI =====

// Render a single message object into the message list.
// `msg` should include `username`, `created_at` and `message`.
// `currentUser` is used to apply different styling for your messages.
export function addMessage(msg, currentUser) {

  const isMe = msg.username === currentUser;

  const wrapper = document.createElement("div");

  wrapper.className = isMe
    ? "message-row me"
    : "message-row other";

  let content = "";

  if (
    msg.file_type &&
    msg.file_type.startsWith("image/")
  ) {
    imageurltodownload = msg.file_url;
    content += `
      <img
        src="${msg.file_url}"
        class="chat-image"
        alt="uploaded image"
        data-full-image="${msg.file_url}"
      >
    `;
  }

  if (msg.message) {

    content += `
      <div>
        ${msg.message}
      </div>
    `;
  }

  wrapper.innerHTML = `
    <div class="message-wrapper">

      <div class="message-meta">
        ${msg.username} • ${formatTime(msg.created_at)}
      </div>

      <div class="${isMe ? 'message-bubble me' : 'message-bubble other'}">
        ${content}
      </div>

    </div>
  `;

  messagesEl.appendChild(wrapper);
  //make the image clickable to view in full size
  const image =
    wrapper.querySelector(".chat-image");

if (image) {

image.addEventListener("click", () => {

    const imageUrl = image.dataset.fullImage;

    const lightbox =
        document.getElementById("lightbox");

    const lightboxImg =
        document.getElementById("lightboxImg");

    const downloadBtn =
        document.getElementById("lightboxDownload");

    lightboxImg.src = imageUrl;

    downloadBtn.href = imageUrl;

    lightbox.classList.remove("hidden");
});
}


  scrollToBottom();
}

// ===== ONLINE USERS UI =====

// Update the small badge that shows how many users are online.
export function updateOnlineCount(count) {
  const badge = document.getElementById("onlineCount");
  if (badge) {
    badge.textContent = count
  }
}


//show the people in the room, and the green dot next to their name if they are online
// Render the list of online `users` into the members lists (desktop + mobile).
export function displayOnlineUsers(users) {
  membersList.innerHTML = "";
  mobileMembersList.innerHTML = "";


  users.forEach(user => {
    const div = document.createElement("div");
    div.className = "member-item";

    div.innerHTML = `
      <div class="member-avatar">
        <span class="online-dot"></span>
      </div>

      <div class="member-name">
        ${user.username}
      </div>
    `;

    membersList.appendChild(div);
    mobileMembersList.appendChild(div.cloneNode(true));
  });
}


// it freaking works now
// Toggle visibility of the mobile sidebar and its overlay.
export function toggleSidebar() {

  const sidebar =
    document.getElementById("mobileSidebar");

  const overlay =
    document.getElementById("sidebarOverlay");

  sidebar.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
}

const downloadBtn =
    document.getElementById("lightboxDownload");

downloadBtn.href = imageurltodownload;