// Shared runtime state used across modules. These are simple exported
// variables (not a state manager) so modules can read/update them.
export let currentUser = null;
export let currentRoom = "general";
export let realtimeChannel = null;

export let presenceInterval = null;
export let usersInterval = null;