let userType = "general";

function selectType(type) {
    userType = type;
    document.getElementById("step1").classList.add("hidden");
    document.getElementById("step2").classList.remove("hidden");
}

function loadImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        document.getElementById("preview").src = reader.result;
        generateRoast();
        document.getElementById("result").classList.remove("hidden");
    }

    reader.readAsDataURL(file);
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

    html2canvas(card).then(canvas => {
        canvas.toBlob(blob => {
            const file = new File([blob], "eid-roast.png", { type: "image/png" });

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