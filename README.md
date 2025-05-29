# WhatsApp Business Webhook – Node.js + Express

A lightweight WhatsApp Business Webhook built with Node.js and Express to handle incoming messages and respond dynamically using the WhatsApp Business Cloud API (Graph API). It supports text inputs, button replies, and message templates with document attachments.

## 🚀 Features

- Webhook verification endpoint for WhatsApp Business API
- Real-time logging of incoming messages
- Interactive button support (payload-based)
- Text recognition and templated message replies
- Document-based template messaging (PDF attachment support)
- Stateful handling via in-memory user stage tracking

## 📦 Stack

- **Node.js** (v18+ recommended)
- **Express**
- **Graph API communication**

## 🔗 WhatsApp Business Configuration
Set your webhook URL to https://<your-domain>/webhook

Use the WEBHOOK_VERIFY_TOKEN to verify during webhook setup

Make sure your app has permissions:

whatsapp_business_messaging

whatsapp_business_management

## 🧠 Message Handling Logic
Text messages

If contains "insurance" → sends a template with name + policy + date + PDF attachment

Otherwise, sends a greeting offering insurance options

Button replies

Payload: More Details → sends acknowledgment text

Other payloads: echoes received payload

## 📁 Project Structure

├── server.js # Express app and webhook logic
├── .env # Environment variables (not included)
├── README.md

## ⚙️ Environment Variables

Create a `.env` file in the project root with the following:

```env
PORT=3000
WEBHOOK_VERIFY_TOKEN=your_webhook_token
GRAPH_API_TOKEN=your_graph_api_token
PHONE_NUMBER_ID=your_phone_number_id
```

## 📤 Testing
You can test using:

WhatsApp Sandbox or real business account

Tools like ngrok for exposing localhost during dev


## 🧑‍💻 Author

Built by **Rakshit Bansal** — learning and exploring how APIs and messaging platforms connect, sending files as attachments in marketing templates.  
Feel free to fork or suggest improvements!


