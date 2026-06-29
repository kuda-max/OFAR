// ===== UI HELPERS =====
// Purpose: Small, reusable DOM helper functions for rendering messages
// and online user lists. These keep rendering logic separate from
// data and network code.

import { messagesEl, messagesContainer, membersList, mobileMembersList, emojiBtn, emojiPicker} from "./dom.js";
import { populateEmojiGrid } from "./emojis.js";
import {
  replyingTo,
  setReplyingTo
} from "./state.js";

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

export function addDateSeparator(dateText) {

  const separator =
    document.createElement("div");

  separator.className =
    "date-separator";

  separator.textContent =
    dateText;

  messagesEl.appendChild(
    separator
  );
}

export function addNewMessagesDivider() {

  const divider =
    document.createElement("div");

  divider.className =
    "new-messages-divider";

  divider.textContent =
    "NEW MESSAGES";

  messagesEl.appendChild(
    divider
  );
}

export function addMessage(
  msg,
  currentUser,
  repliedMessage = null
) {

  const isMe = msg.username === currentUser;

  const wrapper = document.createElement("div");
  wrapper.id =`message-${msg.id}`;
  wrapper.className = isMe
    ? "message-row me"
    : "message-row other";

  let content = "";

  if (repliedMessage) {
  content += `
    <div class="reply-snippet"
      data-target="${repliedMessage.id}"
      >
      <div class="reply-snippet-user">
        ↩ ${repliedMessage.username}
      </div>

      <div class="reply-snippet-text">
        ${
          repliedMessage.message ||
          repliedMessage.file_name ||
          "File"
        }
      </div>

    </div>
  `;
}

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

else if (msg.file_url) {

  content += `
    <div class="file-message">

      <div class="file-info">
        📄 ${msg.file_name}
      </div>

      <button
        class="file-download-btn"
         data-name="${msg.file_name}"
         data-url="${msg.file_url}"
      >
        Download
      </button>

    </div>
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

    <div class="${
      isMe
        ? "message-bubble me"
        : "message-bubble other"
    }">

      ${content}

    </div>

  </div>
`;




  const bubble =
    wrapper.querySelector(
      ".message-bubble"
    );

  bubble.addEventListener(
    "click",
    () => {
      setReplyingTo({
  id: msg.id,
  username: msg.username,
  preview:
    msg.message ||
    msg.file_name ||
    "File"
});

      showReplyPreview();

    }
  );
  messagesEl.appendChild(wrapper);
  const replySnippet =
  wrapper.querySelector(
    ".reply-snippet"
  );

if (replySnippet) {

  replySnippet.addEventListener(
    "click",
    (e) => {

      e.stopPropagation();

      const targetId =
        replySnippet.dataset.target;

      const target =
        document.getElementById(
          `message-${targetId}`
        );

      if (target) {

        target.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        target.classList.add(
          "message-highlight"
        );

        setTimeout(() => {

          target.classList.remove(
            "message-highlight"
          );

        }, 2000);

      }

    }
  );

}

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


const downloadButton =
  wrapper.querySelector(".file-download-btn");

if (downloadButton) {

  downloadButton.addEventListener(
    "click",
    async (e) => {

      e.preventDefault();
      try {

        const response =
          await fetch(
            downloadButton.dataset.url
          );

        const blob =
          await response.blob();

        const url =
          URL.createObjectURL(blob);

        const a =
          document.createElement("a");

        a.href = url;

        a.download =
          downloadButton.dataset.name;

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
}
//scrollToBottom();
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


emojiBtn.addEventListener(
  "click",
  () => {
    populateEmojiGrid();
    emojiPicker.classList.toggle(
      "hidden"
    );

  }
);

document.addEventListener(
  "click",
  (e) => {

    const clickedEmojiButton =
      emojiBtn.contains(
        e.target
      );

    const clickedPicker =
      emojiPicker.contains(
        e.target
      );

    if (
      !clickedEmojiButton &&
      !clickedPicker
    ) {

      emojiPicker.classList.add(
        "hidden"
      );

    }

  }
);

function showReplyPreview() {

  const container =
    document.getElementById(
      "replyContainer"
    );

  if (!replyingTo) {

    container.innerHTML = "";

    return;
  }

  container.innerHTML = `
    <div class="reply-preview">

      <div class="reply-header">
        Replying to ${replyingTo.username}

        <button
          id="cancelReplyBtn"
        >
          ✕
        </button>

      </div>

      <div class="reply-text">
        ${replyingTo.preview}
      </div>

    </div>
  `;

  document
    .getElementById(
      "cancelReplyBtn"
    )
    .addEventListener(
      "click",
      () => {

        setReplyingTo(
  null
);

        showReplyPreview();

      }
    );
}