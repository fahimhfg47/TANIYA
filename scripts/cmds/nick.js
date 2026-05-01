const LOCKED_AUTHOR = "FARHAN-KHAN";

module.exports = {
  config: {
    name: "nick",
    aliases: ["sn"],
    version: "2.0",
    author: LOCKED_AUTHOR,
    countDown: 5,
    role: 1,
    shortDescription: {
      en: "Change nickname by reply"
    },
    longDescription: {
      en: "Reply to a user and change only that user's nickname"
    },
    category: "owner",
    guide: {
      en: "{pn} <new nickname>\nReply to a user's message"
    }
  },

  langs: {
    en: {
      missingNickname: "Please enter a nickname.",
      missingReply: "Reply to someone's message first.",
      success: "Successfully changed nickname to: %1",
      failed: "Failed to change nickname.",
      authorError: "Author modified. File locked."
    }
  },

  onStart: async function ({ api, event, args, message, getLang }) {

    // 🔒 Author Lock
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      throw new Error(getLang("authorError"));
    }

    // 📝 Nickname
    const newNickname = args.join(" ");

    if (!newNickname) {
      return message.reply(getLang("missingNickname"));
    }

    // 📌 Must reply
    if (!event.messageReply) {
      return message.reply(getLang("missingReply"));
    }

    try {
      const targetID = event.messageReply.senderID;
      const threadID = event.threadID;

      // ✅ Change nickname only for replied user
      await api.changeNickname(newNickname, threadID, targetID);

      return message.reply(getLang("success", newNickname));

    } catch (e) {
      console.log(e);
      return message.reply(getLang("failed"));
    }
  }
};
