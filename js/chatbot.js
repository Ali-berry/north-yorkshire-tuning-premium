// Asli AI ke liye: apna backend ya n8n webhook URL yahan daalo jo { reply } return kare.
// API key kabhi bhi is file mein mat rakhna, browser mein sab ko nazar aati hai.
const chatbotSettings = {
  aiEndpoint: "",
};

const chatElements = {
  root: document.getElementById("chat"),
  toggle: document.getElementById("chat-toggle"),
  panel: document.getElementById("chat-panel"),
  close: document.getElementById("chat-close"),
  log: document.getElementById("chat-log"),
  form: document.getElementById("chat-form"),
  input: document.getElementById("chat-input"),
  suggestions: document.getElementById("chat-suggestions"),
};

const starterQuestions = ["Stage 1 price", "DPF light is on", "Do you cover Selby?", "Will it void my warranty?"];
const chatHistory = [];
let hasGreeted = false;

chatElements.toggle.addEventListener("click", openChat);
chatElements.close.addEventListener("click", closeChat);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !chatElements.panel.hidden) closeChat();
});

chatElements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = chatElements.input.value.trim();
  if (!message) return;
  chatElements.input.value = "";
  handleUserMessage(message);
});

chatElements.suggestions.addEventListener("click", (event) => {
  const chip = event.target.closest("button");
  if (chip) handleUserMessage(chip.textContent);
});

function openChat() {
  chatElements.panel.hidden = false;
  chatElements.root.classList.add("is-open");
  chatElements.toggle.setAttribute("aria-expanded", "true");
  if (!hasGreeted) {
    hasGreeted = true;
    addChatMessage("bot", `Hi, this is the ${shopInfo.name} assistant. Ask me about remaps, warning lights, prices or the areas we cover.`);
    showSuggestions(starterQuestions);
  }
  chatElements.input.focus();
}

function closeChat() {
  chatElements.panel.hidden = true;
  chatElements.root.classList.remove("is-open");
  chatElements.toggle.setAttribute("aria-expanded", "false");
  chatElements.toggle.focus();
}

function addChatMessage(sender, text) {
  const bubble = document.createElement("p");
  bubble.className = `chat-msg from-${sender}`;
  bubble.textContent = text;
  chatElements.log.appendChild(bubble);
  chatElements.log.scrollTop = chatElements.log.scrollHeight;
  chatHistory.push({ role: sender === "user" ? "user" : "assistant", content: text });
  return bubble;
}

function showSuggestions(options) {
  chatElements.suggestions.innerHTML = options
    .map((option) => `<button class="chip" type="button">${option}</button>`)
    .join("");
}

async function handleUserMessage(message) {
  addChatMessage("user", message);
  chatElements.suggestions.innerHTML = "";

  const typing = document.createElement("p");
  typing.className = "chat-msg from-bot is-typing";
  typing.textContent = "Typing…";
  chatElements.log.appendChild(typing);
  chatElements.log.scrollTop = chatElements.log.scrollHeight;

  const reply = await getBotReply(message);
  typing.remove();
  addChatMessage("bot", reply.text);
  showSuggestions(reply.suggestions || ["Get a price", "Prices"]);
}

async function getBotReply(message) {
  if (chatbotSettings.aiEndpoint) {
    try {
      const response = await fetch(chatbotSettings.aiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: chatHistory.slice(-10), shop: shopInfo, services, carProblems }),
      });
      const data = await response.json();
      if (data.reply) return { text: data.reply };
    } catch (error) {
      // AI band ho to neeche wala local jawab chal jayega
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 450));
  return answerFromShopInfo(message.toLowerCase());
}

function answerFromShopInfo(text) {
  const hasWord = (...words) => words.some((word) => text.includes(word));
  const contact = `Call or text ${shopInfo.phone}, or WhatsApp the same number.`;

  if (hasWord("open booking form", "get a price")) {
    scrollToSection(document.getElementById("book"));
    return { text: "Taking you to the form. Your reg is all we need to start." };
  }
  if (hasWord("warranty")) {
    return { text: "A remap is a modification, so it can affect a manufacturer warranty claim on the engine or gearbox. We save your original file and can put it back. If the car is under warranty, ask us before booking." };
  }
  if (hasWord("insur")) {
    return { text: shopFaqs[1].a };
  }
  if (hasWord("safe", "damage", "reliab", "engine life")) {
    return { text: shopFaqs[0].a };
  }
  if (hasWord("reverse", "back to standard", "undo", "original")) {
    return { text: shopFaqs[3].a };
  }
  if (hasWord("how long", "take")) {
    return { text: shopFaqs[2].a };
  }

  // town naam ho to seedha check
  const town = serviceAreas.find((item) => text.includes(item.toLowerCase()));
  if (town) {
    return { text: `Yes, we cover ${town}. We come to your home or workplace there.`, suggestions: ["Get a price", "Stage 1 price"] };
  }
  if (hasWord("area", "cover", "come to", "where are", "where do", "travel", "mobile")) {
    return { text: `We're fully mobile across North Yorkshire and Leeds, including York, Harrogate, Selby, Wetherby, Thirsk and Tadcaster. Tell me your town and I'll check.` };
  }
  if (hasWord("book", "appointment", "available", "when can")) {
    return { text: `Send your reg with the form on this page and we'll confirm the method, price and a time. ${contact}`, suggestions: ["Open booking form"] };
  }
  if (hasWord("phone", "call", "number", "whatsapp", "contact", "email")) {
    return { text: `${contact} Email: ${shopInfo.email}.` };
  }
  if (hasWord("obd", "bench", "boot")) {
    return { text: tuningMethods.map((method) => `${method.title}: ${method.text}`).join("\n\n") };
  }
  if (hasWord("stage 2", "stage two")) {
    return { text: "Stage 2 is for cars with supporting hardware, like an uprated intake, intercooler or exhaust. It builds on Stage 1 and starts from £200 depending on the car. Send your reg for an exact price.", suggestions: ["Get a price"] };
  }

  const matchedProblem = carProblems.find((problem) => problem.keywords.some((keyword) => text.includes(keyword)));
  if (matchedProblem && !hasWord("price", "cost", "how much")) {
    const service = findServiceById(matchedProblem.service);
    const price = service.price === null ? "Price on request." : `${service.name} starts from ${formatPrice(service.price)}.`;
    return { text: `${matchedProblem.fix} ${price}`, suggestions: ["Get a price", "Which areas?"] };
  }

  const matchedService = services.find((service) => text.includes(service.id) || text.includes(service.name.toLowerCase().split(" ")[0]));
  if (matchedService) {
    return {
      text: `${matchedService.name}: ${matchedService.price === null ? "price on request" : `from ${formatPrice(matchedService.price)}`}. ${matchedService.text}`,
      suggestions: ["Get a price", "Other prices"],
    };
  }

  if (hasWord("price", "cost", "how much", "prices", "rate", "charge")) {
    const list = services.filter((service) => service.price !== null).map((service) => `${service.name}: from ${formatPrice(service.price)}`).join("\n");
    return { text: `Starting prices:\n${list}\n\nOther services are priced for your car. The exact price depends on your make, model and ECU, so send your reg.`, suggestions: ["Get a price"] };
  }

  if (hasWord("hi", "hello", "hey", "salam")) {
    return { text: "Hello! Ask me about remaps, DPF or AdBlue faults, prices or the areas we cover.", suggestions: starterQuestions };
  }

  return {
    text: `Good question for the tuner. ${contact}`,
    suggestions: starterQuestions,
  };
}
