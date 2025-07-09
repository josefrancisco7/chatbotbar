const form = document.getElementById("chat-form");
const chatWindow = document.getElementById("chat");
const input = document.getElementById("user-input");
const audioBtn = document.getElementById("audio-btn");
const micIcon = document.getElementById("mic-icon");

const params = new URLSearchParams(window.location.search);
const mesa = params.get("mesa") || "No Disponible";

window.addEventListener("DOMContentLoaded", () => {
  let bienvenida = mesa !== "No Disponible"
    ? `👋 ¡Bienvenido/a a Bar La Esquina!\n🪑 Estás en la mesa ${mesa}.\n\n✍️ Escribe aquí tu pedido en español o gallego.\n🍔🍟🍕🍻🥤☕\n¡Cuéntanos qué te apetece hoy! 😃`
    : `👋 ¡Bienvenido/a a Bar La Esquina!\n\n✍️ Escribe aquí tu pedido en español o gallego.\n🍔🍟🍕🍻🥤☕\n¡Cuéntanos qué te apetece hoy! 😃`;
  addMessage(bienvenida, "bot");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userText = input.value.trim();
  if (!userText) return;

  addMessage(userText, "user");
  input.value = "";
  scrollToBottom();
  showTypingIndicator();

  const bodyToSend = { message: userText, mesa };

  try {
    const response = await fetch("http://flybots.agency:5678/webhook/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyToSend)
    });

    if (!response.ok) throw new Error("Error en la respuesta del servidor");

    const data = await response.json();
    removeTypingIndicator();
    addMessage(data.reply || "Lo siento, no entendí eso.", "bot");
  } catch (error) {
    removeTypingIndicator();
    addMessage("Error de conexión. Intenta más tarde.", "bot");
    console.error(error);
  }
});

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.innerHTML = sender === "bot" ? text.replace(/\n/g, "<br>") : text;
  chatWindow.appendChild(div);
  scrollToBottom();
}

function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTypingIndicator() {
  if (document.getElementById("typing-indicator")) return;

  const div = document.createElement("div");
  div.classList.add("message", "bot");
  div.id = "typing-indicator";

  const typing = document.createElement("div");
  typing.classList.add("typing-indicator");

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    typing.appendChild(dot);
  }

  div.appendChild(typing);
  chatWindow.appendChild(div);
  scrollToBottom();
}



function removeTypingIndicator() {
  const typingDiv = document.getElementById("typing-indicator");
  if (typingDiv) typingDiv.remove();
}

// --------------------- AUDIO ---------------------
let mediaRecorder;
let audioChunks = [];
let recordingTimeout = null;
let recording = false;

audioBtn.addEventListener("mousedown", startRecording);
audioBtn.addEventListener("touchstart", startRecording);
window.addEventListener("mouseup", stopRecording);
window.addEventListener("touchend", stopRecording);
audioBtn.addEventListener("mouseleave", cancelIfRecording);
audioBtn.addEventListener("touchcancel", cancelIfRecording);

function startRecording(e) {
  e.preventDefault();
  if (recording) return;
  recording = true;
  audioBtn.classList.add("recording");
  micIcon.classList.add("mic-glow");

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        recording = false;
        audioBtn.classList.remove("recording");
        micIcon.classList.remove("mic-glow");
        mediaRecorder.stream.getTracks().forEach(track => track.stop());

        if (audioChunks.length > 0) {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          addAudioMessage(audioBlob, "user");
          showTypingIndicator();
          await sendAudioToBackend(audioBlob);
        }
      };

      mediaRecorder.start();

      recordingTimeout = setTimeout(() => {
        if (mediaRecorder && mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
      }, 60000);
    })
    .catch(() => {
      recording = false;
      audioBtn.classList.remove("recording");
      micIcon.classList.remove("mic-glow");
      alert("No se puede acceder al micrófono");
    });
}

function stopRecording(e) {
  if (!recording) return;
  e.preventDefault();
  clearTimeout(recordingTimeout);
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
}

function cancelIfRecording(e) {
  if (recording) stopRecording(e);
}

function addAudioMessage(blob, sender) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  const audio = document.createElement("audio");
  audio.controls = true;
  audio.src = URL.createObjectURL(blob);
  div.appendChild(audio);
  chatWindow.appendChild(div);
  scrollToBottom();
}

async function sendAudioToBackend(blob) {
  const formData = new FormData();
  formData.append("audio", blob, "audio.webm");
  formData.append("mesa", mesa);

  try {
    const response = await fetch("http://192.168.1.42:5678/webhook/chatbot", {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Error en respuesta de audio");

    const data = await response.json();
    removeTypingIndicator();
    addMessage(data.reply || "Audio recibido, gracias.", "bot");
  } catch (error) {
    removeTypingIndicator();
    console.error("Error enviando audio:", error);
    addMessage("No se pudo procesar el audio.", "bot");
  }
}
