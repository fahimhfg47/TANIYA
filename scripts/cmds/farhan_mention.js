const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "farhan_mention",
    version: "7.0.0",
    author: "Farhan-Khan", // ⚠️ এটা change করলে bot বন্ধ হয়ে যাবে
    countDown: 0,
    role: 0,
    shortDescription: "Admin mention reply styled",
    category: "system"
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {

    // 🔒 AUTHOR LOCK
    if (this.config.author !== "Farhan-Khan") {
      console.log("⚠️ Author changed! Module stopped.");
      return;
    }

    // 👑 ADMINS
    const admins = [
      {
        uid: "61589439339903",
        names: ["ফাৃঁ'রৃঁ'হা্ঁ'নৃঁ"]
      },
      {
        uid: "61589976056816",
        names: ["ヽ｟ᏟᎬϴ｠▁▁ዐዐዐ 👿"]
      }
    ];

    const senderID = String(event.senderID);

    // ❌ Admin নিজে লিখলে reply দিবে না
    if (admins.some(a => a.uid === senderID)) return;

    const text = (event.body || "").toLowerCase().trim();
    const mentionedIDs = event.mentions ? Object.keys(event.mentions) : [];

    // 🔍 MENTION DETECT
    const isMentioning = admins.some(admin =>
      mentionedIDs.includes(admin.uid) ||
      text.includes(admin.uid) ||
      admin.names.some(name => text.includes(name.toLowerCase()))
    );

    if (!isMentioning) return;

    // 💬 RAW CAPTIONS
    const captions = [
      "Mantion_দিস না ফাহিম বস এর মন মন ভালো নেই আস্কে-!💔🥀",
      "- আমার বস ফাহিম এর সাথে কেউ সেক্স করে না থুক্কু টেক্স করে নাহ🫂💔",
      "👉আমার বস ♻️ 𝗙𝗔𝗛𝗜𝗠 এখন বিজি আছে । তার ইনবক্সে এ মেসেজ দিয়ে রাখো 🔰 ♪√বস ফ্রি হলে আসবে🧡😁😜🐒",
      "বস ফাহিম কে এত মেনশন না দিয়ে বক্স আসো হট করে দিবো🤷‍ঝাং 😘🥒",
      "বস ফাহিম কে Mantion_দিলে চুম্মাইয়া ঠুটের কালার change কইরা,লামু 💋😾😾🔨",
      "ফাহিম বস এখন বিজি জা বলার আমাকে বলতে পারেন_!!😼🥰",
      "ফাহিম বস কে এতো মেনশন নাহ দিয়া বস কে একটা জি এফ দে 😒 😏",
      "Mantion_না দিয়ে বস ফাহিম এর সাথে সিরিয়াস প্রেম করতে চাইলে ইনবক্স",
      "বস ফাহিম কে মেনশন দিসনা পারলে একটা জি এফ দে",
      "বাল পাকনা Mantion_দিস না বস ফাহিম প্রচুর বিজি আছে 🥵🥀🤐",
      "চুমু খাওয়ার বয়স টা আমার বস ফাহিম চকলেট🍫খেয়ে উড়িয়ে দিল 🤗"
    ];

    const formatCaption = (text) => {
      return `
━━━━━━━━━━━━━━━━━━━━
- ${text}
━━━━━━━━━━━━━━━━━━━━`;
    };

    const rawCaption = captions[Math.floor(Math.random() * captions.length)];
    const styledCaption = formatCaption(rawCaption);

    // 🎥 RANDOM VIDEO
    const videoLinks = [
      "https://files.catbox.moe/zah3gd.mp4",
      "https://files.catbox.moe/dnuqtb.mp4",
      "https://files.catbox.moe/euhh1j.mp4",
      "https://files.catbox.moe/28zdh0.mp4",
      "https://files.catbox.moe/u6uhih.mp4",
      "https://files.catbox.moe/kjuygx.mp4",
      "https://files.catbox.moe/agbbr7.mp4",
      "https://files.catbox.moe/v0c93q.mp4",
      "https://files.catbox.moe/vn4iiv.mp4",
      "https://files.catbox.moe/lw4gip.mp4",
      "https://files.catbox.moe/7dhh65.mp4",
      "https://files.catbox.moe/t1o8nu.mp4",
      "https://files.catbox.moe/53ki3x.mp4",
      "https://files.catbox.moe/2riyds.mp4",
      "https://files.catbox.moe/u2inzy.mp4",
      "https://files.catbox.moe/zabqtx.mp4",
      "https://files.catbox.moe/lvat8q.mp4",
      "https://files.catbox.moe/8iohbn.mp4",
      "https://files.catbox.moe/zs1v3i.mp4",
      "https://files.catbox.moe/sdcjc6.mp4"
    ];

    const randomVideo =
      videoLinks[Math.floor(Math.random() * videoLinks.length)];

    const videoPath = path.join(__dirname, "cache", "mention.mp4");

    try {

      // 📩 FIRST: CAPTION ONLY
      await message.reply({
        body: styledCaption
      });

      // 🎥 THEN VIDEO (separate message)
      setTimeout(async () => {

        const videoResponse = await axios({
          url: randomVideo,
          method: "GET",
          responseType: "stream"
        });

        const videoWriter = fs.createWriteStream(videoPath);
        videoResponse.data.pipe(videoWriter);

        videoWriter.on("finish", async () => {

          await message.reply({
            attachment: fs.createReadStream(videoPath)
          });

          fs.unlinkSync(videoPath);
        });

      }, 2000);

    } catch (err) {
      console.log("Error sending admin reply:", err);
    }
  }
};