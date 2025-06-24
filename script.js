const form = document.getElementById("chat-form");
const chatWindow = document.getElementById("chat");
const input = document.getElementById("user-input");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userText = input.value.trim();
  if (!userText) return;

  addMessage(userText, "user");
  input.value = "";
  scrollToBottom();

  try {
    const response = await fetch("http://192.168.1.42:5678/webhook/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText })
    });

    if (!response.ok) throw new Error("Error en la respuesta del servidor");

    const data = await response.json();
    const botText = data.reply || "Lo siento, no entendí eso.";
    addMessage(botText, "bot");
    scrollToBottom();

  } catch (error) {
    addMessage("Error de conexión. Intenta más tarde.", "bot");
    scrollToBottom();
    console.error(error);
  }
});

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = text;
  chatWindow.appendChild(div);
}

function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
