import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const {
  WEBHOOK_VERIFY_TOKEN,
  GRAPH_API_TOKEN,
  PHONE_NUMBER_ID,
  PORT = 3000,
} = process.env;

const userState = {};

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hello, Rakshit. Webhook is running!");
});

// Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token_verify = req.query["hub.verify_token"];

  if (mode === "subscribe" && token_verify === WEBHOOK_VERIFY_TOKEN) {
    console.log(" Webhook verified!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});
// Webhook handler
app.post("/webhook", async (req, res) => {
  const body = req.body;

  console.log("📩 Incoming payload:", JSON.stringify(body, null, 2));

  if (
    body.object === "whatsapp_business_account" &&
    body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]
  ) {
    const message = body.entry[0].changes[0].value.messages[0];
    const from = message.from;

    if (message.type === "button") {
      const payload = message.button.payload;
      console.log("🔘 Button payload received:", payload);

      if (payload.toLowerCase() === "more details") {
        await sendText(from, "Thank you! Our team will get back to you shortly.");
        userState[from] = { stage: "done" };
      } else {
        await sendText(from, "Button received: " + payload);
      }
    }

    else if (message.type === "text") {
      const text = message.text.body.toLowerCase();

      if (text.includes("insurance")) {
        await sendInsuranceTemplate(from);
        userState[from] = { stage: "insurance_sent" };
      } else {
        if (!userState[from] || userState[from].stage === "done") {
          await sendText(
            from,
            "Hi! Would you like to explore our insurance offers? Type *Insurance* to begin."
          );
          userState[from] = { stage: "greeted" };
        }
      }
    }
  }

  res.sendStatus(200);
});


async function sendText(to, message) {
  await axios.post(
    `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message },
    },
    {
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log(`📤 Sent text to ${to}: "${message}"`);
}

async function sendInsuranceTemplate(to) {
  await axios.post(
    `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: "insurance",
        language: { code: "en_US" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: "Rakshit" },
              { type: "text", text: "RakInsurance Premium" },
              { type: "text", text: "May 28, 2025" },
            ],
          },
          {
            type: "header",
            parameters: [
              {
                type: "document",
                document: {
                  link: "https://cdn.glitch.global/32d5cfb6-211a-4511-ae4f-52130373692b/insurance.pdf?v=1748505800536",
                  filename: "insurance.pdf",
                },
              },
            ],
          },
        ],
      },
    },
    {
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log(`📤 Sent insurance template to ${to}`);
}

// 🚀 Start server
app.listen(PORT, () => console.log(" Server ready on port " + PORT));
