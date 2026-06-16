// ===== LOCAL STORAGE HELPERS =====

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
