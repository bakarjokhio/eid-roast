let userType = "general";
let dominantColorGlobal = "rgb(0,0,0)";
let oppositeColorGlobal = "rgb(255,255,255)";

function selectType(type) {
  userType = type;
  history.pushState({
    step: 2
  }, "");

  document.getElementById("step1").classList.add("hidden");
  document.getElementById("step2").classList.remove("hidden");
}

function loadImage(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const img = document.getElementById("preview");
    img.src = reader.result;

    img.onload = function () {
      getDominantColor(img);
    };
    generateRoast();
    document.getElementById("result").classList.remove("hidden");
  }

  reader.readAsDataURL(file);
}

function getDominantColor(img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  const colorMap = {};
  let maxCount = 0;

  for (let i = 0; i < data.length; i += 40) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const key = `${r},${g},${b}`;
    colorMap[key] = (colorMap[key] || 0) + 1;

    if (colorMap[key] > maxCount) {
      maxCount = colorMap[key];
      dominantColorGlobal = `rgb(${key})`;
    }
  }

  // Calculate opposite color
  const values = dominantColorGlobal.match(/\d+/g);
  const r = 255 - values[0];
  const g = 255 - values[1];
  const b = 255 - values[2];

  oppositeColorGlobal = `rgb(${r},${g},${b})`;

  // Set UI colors
  document.getElementById("dominantColor").style.background = dominantColorGlobal;
  document.getElementById("oppositeColor").style.background = oppositeColorGlobal;

  // Show picker
  document.getElementById("colorOptions").classList.remove("hidden");

  // Default apply
  applyCardColor(dominantColorGlobal);
}
/** function getDominantColor(img) {
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = img.width;
canvas.height = img.height;

ctx.drawImage(img, 0, 0);

const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

const colorMap = {};
let maxCount = 0;
let dominantColor = "rgb(0,0,0)";

// Loop through pixels (skip some for performance)
for (let i = 0; i < data.length; i += 40) {
const r = data[i];
const g = data[i + 1];
const b = data[i + 2];

const key = `${r},${g},${b}`;

colorMap[key] = (colorMap[key] || 0) + 1;

if (colorMap[key] > maxCount) {
maxCount = colorMap[key];
dominantColor = `rgb(${key})`;
}
}

applyCardColor(dominantColor);
} **/

function applyCardColor(color) {
  const card = document.getElementById("shareCard");

  // 🎯 Normalize named colors to RGB
  if (color === "black") color = "rgb(0,0,0)";
  if (color === "white") color = "rgb(255,255,255)";

  card.style.background = color;
  card.style.color = getContrastColor(color);

  // Extract RGB
  const values = color.match(/\d+/g);
  const r = values[0];
  const g = values[1];
  const b = values[2];

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  const intensity = brightness > 150 ? 0.3: 0.7;

  const glowColor = `rgba(${r}, ${g}, ${b}, ${intensity})`;

  card.style.boxShadow = `
  0 0 8px ${glowColor},
  0 0 18px ${glowColor},
  inset 0 0 35px ${glowColor}
  `;
}

function getContrastColor(rgb) {
  const values = rgb.match(/\d+/g);
  const r = values[0];
  const g = values[1];
  const b = values[2];

  // brightness formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 125 ? "black": "white";
}

// 🎯 DATASET (Roasts)

const roasts = {
  male: [
    "Bhai outfit theek hai... lekin confidence zyada pehna hua hai 😭🔥",
    "Sigma banne nikle thay... mohallay ka hero ban gaye 💀",
    "Drip level: Shaadi mein free khanay wala guest 🍗",
    "MashAllah... Ammi ne zabardasti tayar kiya hai na? 😂",
    "Kapray ache hain... pose thora update kar lo boss 😎"
  ],

  female: [
    "MashAllah queen vibes 👑 lekin thori over killing ho gayi 😭🔥",
    "Aunty approved ✔️ Rishta incoming 💍",
    "Itni tayyari... Chand bhi jealous ho gaya 🌙",
    "Outfit 10/10, nazrein control mein rakho logon ki 😂",
    "Pookie princess mode activated 🐣✨"
  ],

  general: [
    "Eid outfit ya fashion experiment? 🤔🔥",
    "Confidence 100%, logic 0% 😭",
    "Chand Raat energy still loading… ⏳",
    "Yeh style hai ya statement? 😂",
    "Log dekh rahe hain… samajh nahi aa raha 😎"
  ]
};

function generateRoast() {
  const list = roasts[userType];
  const random = list[Math.floor(Math.random() * list.length)];
  document.getElementById("roastText").innerText = random;
}

// 📤 SHARE FUNCTION

function shareImage() {
  const card = document.getElementById("shareCard");

  html2canvas(card, {
    backgroundColor: null
  }).then(canvas => {
    canvas.toBlob(blob => {
      const file = new File([blob], "eid-roast.png", {
        type: "image/png"
      });

      if (navigator.share) {
        navigator.share({
          title: "Eid Outfit Roast 😂🔥",
          text: "Check your Eid Outfit Roast 😂🔥",
          files: [file]
        });
      } else {
        alert("Sharing not supported on this device");
      }
    });
  });
}

window.onpopstate = function (event) {
  // If going back, show step1 again
  document.getElementById("step1").classList.remove("hidden");
  document.getElementById("step2").classList.add("hidden");

  // Optional: reset result
  document.getElementById("result").classList.add("hidden");
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("color-circle")) {
    
    document.querySelectorAll(".color-circle").forEach(el => {
            el.classList.remove("active");
        });

        // ✅ Add active to selected
        e.target.classList.add("active");


    let color = e.target.dataset.color;

    if (color === "black") color = "rgb(0,0,0)";
    else if (color === "white") color = "rgb(255,255,255)";
    else if (!color && e.target.id === "dominantColor") color = dominantColorGlobal;
    else if (!color && e.target.id === "oppositeColor") color = oppositeColorGlobal;

    applyCardColor(color);
  }
});