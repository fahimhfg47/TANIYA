const axios = require('axios');

// Fetching dynamic API URL from GitHub
const getBaseApiUrl = async () => {
    try {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
    } catch (e) {
        return "https://noobs-api.top";
    }
};

const triggerWords = ["bot"];

module.exports = {
    config: {
        name: "bot",
        aliases: ["Bot", "বট"],
        version: "11.1.0",
        author: "FARHAN-KHAN",
        countDown: 0,
        role: 0,
        description: "Bot responds with AI + fun dialogues",
        category: "fun"
    },

    onStart: async function ({ api, event, args, usersData, commandName }) {
        const { threadID, messageID, senderID } = event;

        try {
            const name = await usersData.getName(senderID);
            const avatar = `https://graph.facebook.com/${senderID}/picture?width=512&height=512`;

            if (!args[0]) {
                return api.sendMessage({
                    body: `𓆩» ${name} «𓆪\nবলুন আমি "বট" আপনাকে কিভাবে সাহায্য করতে পারি? 😘`,
                    attachment: await global.utils.getStreamFromURL(avatar)
                }, threadID, (err, info) => {
                    if (!err) global.GoatBot?.onReply?.set(info.messageID, { commandName, author: senderID });
                }, messageID);
            }

            const baseUrl = await getBaseApiUrl();

            const res = await axios.post(`${baseUrl}/api/hinata`, {
                text: args.join(" "),
                style: 3
            });

            return api.sendMessage({
                body: res.data.message,
                attachment: await global.utils.getStreamFromURL(avatar)
            }, threadID, messageID);

        } catch (err) {
            return api.sendMessage("API Busy! ❌", threadID, messageID);
        }
    },

    onReply: async function ({ api, event }) {
        try {
            const baseUrl = await getBaseApiUrl();
            const senderID = event.senderID;
            const avatar = `https://graph.facebook.com/${senderID}/picture?width=512&height=512`;

            const res = await axios.post(`${baseUrl}/api/hinata`, {
                text: event.body || "hi",
                style: 3
            });

            return api.sendMessage({
                body: res.data.message,
                attachment: await global.utils.getStreamFromURL(avatar)
            }, event.threadID, event.messageID);

        } catch (err) {}
    },

    onChat: async function ({ api, event, usersData }) {
        const { body, senderID, threadID, messageID } = event;
        if (!body) return;

        const lowerBody = body.toLowerCase();

        if (triggerWords.some(word => lowerBody.startsWith(word))) {

            const name = await usersData.getName(senderID);
            const avatar = `https://graph.facebook.com/${senderID}/picture?width=512&height=512`;

            const text = body.replace(/^bot\s*/i, "").trim();

            // 🔥 YOUR OLD CAPTIONS (FULL RESTORED)
            const randomReplies = [
                "🌻🌺💚-আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ-💚🌺🌻",
                "আমি এখন বস 𝗙𝗔𝗛𝗜𝗠 এর সাথে বিজি আছি আমাকে ডাকবেন না-😕😏 ধন্যবাদ-🤝🌻",
                "আমাকে না ডেকে আমার বস 𝗙𝗔𝗛𝗜𝗠 কে একটা জি এফ দাও-😽🫶🌺",
                "ঝাং থুমালে আইলাপিউ পেপি-💝😽",
                "উফফ বুঝলাম না এতো ডাকছেন কেনো-😤😡😈",
                "আজকে আমার মন ভালো নেই তাই আমারে ডাকবেন না-😪🤧",
                "জান তোমার নানি'রে আমার হাতে তুলে দিবা-🙊🙆‍♂",
                "তাকাই আছো কেন চুমু দিবা-🙄🐸😘",
                "আজকে প্রপোজ করে দেখো রাজি হইয়া যামু-😌🤗😇",
                "চুমু থাকতে তোরা বিড়ি খাস কেন বুঝা আমারে-😑😒🐸⚒️",
                "দিন দিন কিছু মানুষের কাছে অপ্রিয় হয়ে যাইতেছি-🙂😿🌸",
                "আমি একটা দুধের শিশু-😇-🫵𝗬𝗢𝗨🐸💦"
            ];

            const rand = randomReplies[Math.floor(Math.random() * randomReplies.length)];

            // no text → fun reply
            if (!text) {
                return api.sendMessage({
                    body: `𓆩» ${name} «𓆪\n\n${rand}`,
                    attachment: await global.utils.getStreamFromURL(avatar)
                }, threadID, messageID);
            }

            // AI reply
            try {
                const baseUrl = await getBaseApiUrl();

                const { data } = await axios.post(`${baseUrl}/api/hinata`, {
                    text,
                    style: 3
                });

                return api.sendMessage({
                    body: data.message,
                    attachment: await global.utils.getStreamFromURL(avatar)
                }, threadID, messageID);

            } catch (err) {}
        }
    }
};