# Bar La Esquina - Chatbot Web + n8n + OpenAI + Google Sheets

Chat web interactivo para pedidos en mesa en bares, conectado con IA y menú dinámico en Google Sheets, desplegado con n8n.

---

## 📸 Descripción del proyecto

- **Interfaz web tipo WhatsApp** para que los clientes hagan pedidos escaneando un QR desde la mesa.
- **Respuestas automáticas y personalizadas** gracias a un agente de OpenAI configurado como camarero virtual.
- **Consulta del menú en tiempo real** desde Google Sheets.
- **Pedidos confirmados** se notifican al personal por Telegram.
- **Soporte para múltiples idiomas:** español y gallego.
- **Sistema modular, ampliable y personalizable.**

---

## 🚀 Funcionalidades principales

- Animación de “...” mientras responde la IA.
- Reconocimiento automático del número de mesa desde la URL.
- Bienvenida visual con emojis y mensaje personalizado.
- Gestión de menú, precios y descripciones vía Google Sheets.
- Confirmación de pedidos y envío automático a Telegram.
- Estructura lista para añadir grabación y envío de mensajes de voz.

---

## 🛠️ Instalación y uso en local

1. **Clona el repositorio:**
    ```bash
    git clone https://github.com/josefrancisco7/chatbotbar.git
    cd chatbotbar
    ```

2. **Abre el archivo `index.html` en tu navegador** para pruebas en local.
    - Para pruebas con QR y mesas:  
      `http://127.0.0.1:5501/index.html?mesa=7`

3. **Configura tu servidor n8n** (ver instrucciones abajo).

---

## 🧩 Integración con n8n

- Importa el flujo **(archivo `n8n-workflow.json` incluido en este repo)** directamente en tu instancia de n8n.
- Necesitas configurar credenciales de Google Sheets, OpenAI y Telegram en n8n.
- El flujo gestiona la lógica de pedidos, confirmaciones y envío a Telegram.

---

## 🗃️ Menú dinámico en Google Sheets

- El menú, los precios y las descripciones se leen en tiempo real de Google Sheets.
- Puedes ampliar los productos fácilmente editando la hoja compartida.

---

## ✨ Puntos faltantes / Mejoras pendientes

- [ ] **Desplegar n8n en un servidor externo** (Hetzner, DigitalOcean, etc.) para acceso público.
- [ ] **Agregar función de audio:** permitir grabar y enviar mensajes de voz desde el chat web.
- [ ] **Comprar el dominio y que funcione todo en conjunto** 
- [ ] **Modificar el js para poner la url del dominio de n8n** 

---