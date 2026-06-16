// ===== UI HELPERS =====

import { messagesEl, messagesContainer, membersList } from "./dom.js";

export function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

export function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

// ===== MESSAGE UI =====

export function addMessage(msg, currentUser) {
  const isMe = msg.username === currentUser;

  const wrapper = document.createElement("div");

  wrapper.className = isMe
    ? "message-row me"
    : "message-row other";

  wrapper.innerHTML = `
    <div class="message-wrapper">
      <div class="message-meta">
        ${msg.username} • ${formatTime(msg.created_at)}
      </div>

      <div class="${isMe ? 'message-bubble me' : 'message-bubble other'}">
        ${msg.message}
      </div>
    </div>
  `;

  messagesEl.appendChild(wrapper);
  scrollToBottom();
}

// ===== ONLINE USERS UI =====

export function updateOnlineCount(count) {
  const badge = document.getElementById("onlineCount");
  if (badge) {
    badge.textContent = count
  }
  console.log("Online users:", data.length);
}

export function displayOnlineUsers(users) {
  membersList.innerHTML = "";

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
  });
}
