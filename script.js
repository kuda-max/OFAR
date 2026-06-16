
const SUPABASE_URL = "https://vkmvmbobvrgmbdcokhbm.supabase.co";

const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbXZtYm9idnJnbWJkY29raGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MTIzODQsImV4cCI6MjA5NzE4ODM4NH0.PlMOjwCRPORoibUzaE9jn76Ak-m9PeU_srX5d63qkqw";


const supabaseClient = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

//ui
const onlineUsersEl = document.getElementById("onlineUsers");
const membersList = document.getElementById("membersList");
const leaveBtn = document.getElementById("leaveBtn");


//get the user and chat from localstorage to prevent removal
const savedUsername = localStorage.getItem("username");


// ===== STATE =====
let presenceInterval = null;
let usersInterval = null;
let currentUser = null;
let currentRoom = "general";
let realtimeChannel = null;

//leave button clicked 
leaveBtn.addEventListener("click", async () => {

    const confirmed =
        confirm("Leave chat?");

    if (!confirmed) return;

    await leaveChat();
});


// ===== DOM =====

const joinScreen = document.getElementById("joinScreen");
const chatScreen = document.getElementById("chatScreen");

const usernameInput = document.getElementById("usernameInput");
const roomInput = document.getElementById("roomInput");
const joinBtn = document.getElementById("joinBtn");

const roomDisplay = document.getElementById("roomDisplay");

const messagesEl = document.getElementById("messages");
const messagesContainer = document.getElementById("messagesContainer");

const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// ===== HELPERS =====

function scrollToBottom() {
messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function formatTime(dateString) {
return new Date(dateString).toLocaleTimeString([], {
hour: "2-digit",
minute: "2-digit"
});
}

// ===== MESSAGE UI =====

function addMessage(msg) {

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

// ===== LOAD HISTORY =====

async function loadMessages() {
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

data.forEach(addMessage);
}

// ===== REALTIME =====

function subscribeToMessages() {
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

            addMessage(msg);
        }
    )
    .subscribe();
}

// ===== SEND =====

async function sendMessage() {
const text = messageInput.value.trim();

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

messageInput.value = "";
}

// ===== JOIN =====

async function joinChat() {

    const username = usernameInput.value.trim();

    if (!username) {
        alert("Enter a username");
        return;
    }

    currentUser = username;

    currentRoom =
        roomInput.value.trim().toLowerCase() || "general";

    // Save user + room
    localStorage.setItem("username", currentUser);
    localStorage.setItem("room", currentRoom);

    roomDisplay.textContent = currentRoom;

    // Show chat
    joinScreen.classList.add("hidden");

    chatScreen.classList.remove("hidden");
    chatScreen.classList.add("flex");

    // Load messages
    await loadMessages();

    // Start realtime
    subscribeToMessages();

    // Add self to online users
    await updatePresence();

    // Load online users list
    await loadOnlineUsers();

    // Prevent duplicate intervals
    if (presenceInterval) {
        clearInterval(presenceInterval);
    }

    if (usersInterval) {
        clearInterval(usersInterval);
    }

    // Presence heartbeat
    presenceInterval = setInterval(() => {
        updatePresence();
    }, 15000);

    // Refresh online users
    usersInterval = setInterval(() => {
        loadOnlineUsers();
    }, 5000);
}

// leave chat
async function leaveChat() {

    if (currentUser) {
        await supabaseClient
            .from("online_users")
            .delete()
            .eq("username", currentUser);
    }

    localStorage.removeItem("username");
    localStorage.removeItem("room");

    currentUser = null;
    currentRoom = "general";

    if (realtimeChannel) {
        supabaseClient.removeChannel(realtimeChannel);
        realtimeChannel = null;
    }

    chatScreen.classList.add("hidden");

    joinScreen.classList.remove("hidden");

    messagesEl.innerHTML = "";

    usernameInput.value = "";
}

// ===== EVENTS =====

joinBtn.addEventListener("click", joinChat);

usernameInput.addEventListener("keydown", e => {
if (e.key === "Enter") joinChat();
});

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", e => {
if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
}
});


//presence
async function updatePresence() {

    if (!currentUser) return;

    await supabaseClient
        .from("online_users")
        .upsert({
            username: currentUser,
            room: currentRoom,
            last_seen: new Date().toISOString()
        });
}

//keep self alive for 15second interval check
setInterval(updatePresence, 15000);

//load online users
async function loadOnlineUsers() {

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

    membersList.innerHTML = "";

    data.forEach(user => {

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

    updateOnlineCount(data.length);
}

function updateOnlineCount(count) {

    const badge = document.querySelector(".online-count");

    if (badge) {
        badge.textContent = `${count} online`;
    }
}


//refresh online users every 5s
setInterval(loadOnlineUsers, 5000);


//clean up when leaving 
window.addEventListener("beforeunload", async () => {

    if (!currentUser) return;

    await supabaseClient
        .from("online_users")
        .delete()
        .eq("username", currentUser);
});

//auto join
window.addEventListener("load", () => {

    const savedUsername = localStorage.getItem("username");

    if (!savedUsername) return;

    usernameInput.value = savedUsername;

    joinChat();
});