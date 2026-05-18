const fs = require("fs-extra");
const path = require("path");
const https = require("https");

const AUTHOR = "FARHAN-KHAN"; // 🔒 LOCKED AUTHOR

exports.config = {
  name: "cutereply",
  version: "2.1.0",
  author: AUTHOR,
  countDown: 0,
  role: 0,
  shortDescription: "Reply with text + image on trigger",
  longDescription: "Trigger মেসেজে reply দিয়ে text + image পাঠাবে",
  category: "system"
};

// =======================
// 🔒 AUTHOR LOCK SYSTEM
// =======================
if (exports.config.author !== AUTHOR) {
  console.log("❌ AUTHOR CHANGED! FILE LOCKED!");
  process.exit(1);
}

// =======================

const cooldown = 10000; // 10 sec
const last = {};

// =======================
// ✨ EASY ADD SECTION ✨
// =======================
const TRIGGERS = [
  {
    words: ["fahim", "Fahim", "FAHIM", "ফাহিম"],
    text: "👉আমার বস♻️ 𝗙𝗔𝗛𝗜𝗠 এখন বিজি আছে । তার ইনবক্সে এ মেসেজ দিয়ে রাখো ‎‎‎‎‎‎‎‎‎[https://www.facebook.com/https://www.facebook.com/fahim.ahmed.raj.207] 🔰 ♪√বস ফ্রি হলে আসবে,! 😜🐒",
    images: [
      "https://i.imgur.com/mIGZnFl.jpeg"
    ]
  },
  {
    words: ["@Mim Akther", "@Mahira Jahan Mitu", "@আঁইঁ লাঁভঁ ইঁউঁ জাঁনঁ"],
    text: "-আমাকে মেনশন দিয়ে লাভ নাই- কারণ আমি একটা মেসেঞ্জার চ্যাট রোবট,🤖 আমাকে বানানো হয়েছে শুধুমাত্র আপনাদেরকে বিনোদনের জন্য, আমাকে বানিয়েছেন আমার বস ফাহিম-😽🫶 [https://www.facebook.com/fahim.ahmed.raj.077",
    images: [
      "https://i.imgur.com/rkrXNso.jpeg",
      "https://i.imgur.com/zrpFJUc.jpeg"
    ]
  }
];
// =======================

exports.onStart = async function () {};

exports.onChat = async function ({ event, api }) {
  try {
    const { threadID, senderID, messageID } = event;
    const body = (event.body || "").toLowerCase().trim();
    if (!body) return;

    // bot নিজের মেসেজ ignore
    if (senderID === api.getCurrentUserID()) return;

    // cooldown
    const now = Date.now();
    if (last[threadID] && now - last[threadID] < cooldown) return;

    let matched = null;
    for (const t of TRIGGERS) {
      if (t.words.some(w => body.includes(w))) {
        matched = t;
        break;
      }
    }
    if (!matched) return;

    last[threadID] = now;

    const imgUrl = matched.images[Math.floor(Math.random() * matched.images.length)];
    const imgName = path.basename(imgUrl);
    const imgPath = path.join(__dirname, imgName);

    if (!fs.existsSync(imgPath)) {
      await download(imgUrl, imgPath);
    }

    // 🔥 reply message
    api.sendMessage(
      {
        body: matched.text,
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      messageID
    );

  } catch (e) {
    console.log(e);
  }
};

// =======================
// DOWNLOAD FUNCTION
// =======================
function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        fs.unlink(dest, () => {});
        return reject();
      }

      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", () => {
      fs.unlink(dest, () => {});
      reject();
    });
  });
}
