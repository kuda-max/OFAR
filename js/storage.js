// ===== LOCAL STORAGE HELPERS =====
// Purpose: Small wrappers around `localStorage` for saving and
// restoring the current username and room. Keeping these centralized
// makes the intent explicit and eases future changes.

export function saveUsername(username) {
  localStorage.setItem("username", username);
}

export function saveRoom(room) {
  localStorage.setItem("room", room);
}

export function getSavedUsername() {
  return localStorage.getItem("username");
}

export function getSavedRoom() {
  return localStorage.getItem("room");
}

export function clearUsername() {
  localStorage.removeItem("username");
}

export function clearRoom() {
  localStorage.removeItem("room");
}

export function clearAll() {
  localStorage.removeItem("username");
  localStorage.removeItem("room");
}
