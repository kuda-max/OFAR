const emojis = [
  "😀","😂","🤣","😍","🥰","😎","🤔","😭",
  "😡","👍","👎","👏","🔥","💯","🎉","❤️",
  "😁","😅","😆","😉","😊","😋","🤩","😜",
  "🤯","😴","🥳","😇","🙌","👌","🤝","💪"
];

const emojiGrid =
  document.getElementById(
    "emojiGrid"
  );

export function populateEmojiGrid() {
emojis.forEach(
  emoji => {

    const button =
      document.createElement(
        "button"
      );

    button.className =
      "emoji-item";

    button.textContent =
      emoji;

    button.addEventListener(
      "click",
      () => {

        messageInput.value +=
          emoji;

        messageInput.focus();

      }
    );

    emojiGrid.appendChild(
      button
    );

  }
);

}