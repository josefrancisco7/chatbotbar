const form = document.getElementById("chat-form");
const chatWindow = document.getElementById("chat");
const input = document.getElementById("user-input");

// Detecta número de mesa de la URL si existe
const params = new URLSearchParams(window.location.search);
const mesa = params.get("mesa") || "No Disponible";

// Mensaje de bienvenida solo visual (no se manda al backend)
window.addEventListener("DOMContentLoaded", () => {
  let bienvenida = "";

  if (mesa && mesa !== "No Disponible") {
    bienvenida =
      "👋 ¡Bienvenido/a a Bar La Esquina!\n" +
      "🪑 Estás en la mesa " + mesa + ".\n\n" +
      "📝 Escribe aquí tu pedido en español o gallego.\n" +
      "🍔🍟🍕🍻🥤☕\n" +
      "¡Cuéntanos qué te apetece hoy! 😃";
  } else {
    bienvenida =
      "👋 ¡Bienvenido/a a Bar La Esquina!\n\n" +
      "📝 Escribe aquí tu pedido en español o gallego.\n" +
      "🍔🍟🍕🍻🥤☕\n" +
      "¡Cuéntanos qué te apetece hoy! 😃";
  }

  addMessage(bienvenida, "bot");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userText = input.value.trim();
  if (!userText) return;

  addMessage(userText, "user");
  input.value = "";
  scrollToBottom();

  // Muestra la animación de la IA escribiendo
  showTypingIndicator();

  // Siempre manda la mesa
  let bodyToSend = { message: userText, mesa: mesa };


  try {
    const response = await fetch("http://192.168.1.42:5678/webhook/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyToSend)
    });

    if (!response.ok) throw new Error("Error en la respuesta del servidor");

    const data = await response.json();

    removeTypingIndicator(); // Quita los puntos cuando llega la respuesta

    const botText = data.reply || "Lo siento, no entendí eso.";
    addMessage(botText, "bot");
    scrollToBottom();

  } catch (error) {
    removeTypingIndicator();
    addMessage("Error de conexión. Intenta más tarde.", "bot");
    scrollToBottom();
    console.error(error);
  }
});

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  if (sender === "bot") {
    div.innerHTML = text.replace(/\n/g, "<br>");
  } else {
    div.textContent = text;
  }
  chatWindow.appendChild(div);
}

function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// --------------------
// ANIMACIÓN "..."
function showTypingIndicator() {
  // Evita duplicar el indicador
  if (document.getElementById('typing-indicator')) return;

  const div = document.createElement("div");
  div.classList.add("message", "bot", "typing");
  div.id = "typing-indicator";
  div.innerHTML = '<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>';
  chatWindow.appendChild(div);
  scrollToBottom();
}

function removeTypingIndicator() {
  const typingDiv = document.getElementById('typing-indicator');
  if (typingDiv) typingDiv.remove();
}
