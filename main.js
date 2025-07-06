const fs = require("fs");
const nodemailer = require("nodemailer");
const cron = require("node-cron");

const emailSubject = "Happy Birthday!🎂🍥";

// birthday data
const Tim = { targetDay: 27, targetMonth: 6, email: "fattim12@gmail.com" };
const Elvis = {
  targetDay: 8,
  targetMonth: 10,
  email: "elvis757@gmail.com",
};
const Princess = { targetDay: 22, targetMonth: 5, email: "palli16@gmail.com" };

const bdMsgsArr = [
  "🎉 Happy Birthday! Wishing you laughter, love, and cake all day long!",
  "🥳 Hope your birthday is as amazing as you are—enjoy every second!",
  "🎂 Cheers to another year of greatness—happy birthday!",
  "🎈 Wishing you a day full of sunshine and smiles. Happy Birthday!",
  "🎁 Have the best birthday ever—you totally deserve it!",
  "🌟 Another year, another adventure! Happy Birthday and much love!",
];

const next = () => {
  const data = fs.readFileSync("index.json", "utf8");
  let parsed = JSON.parse(data);

  const emailmsg = bdMsgsArr[parsed.index];

  parsed.index = (parsed.index + 1) % bdMsgsArr.length;
  fs.writeFileSync("index.json", JSON.stringify(parsed));

  return emailmsg;
};

// transporter setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  port: 465,
  auth: {
    user: "elvm137@gmail.com",
    pass: "dojblidcykzvigrr",
  },
});

// mail sender
const send = async (recipient, subject, message) => {
  try {
    const info = await transporter.sendMail({
      from: "'Elvis'<elvm137@gmail.com>",
      to: recipient,
      subject: subject,
      html: message,
    });

    console.log("Message successfully sent!", info.messageId, message);
  } catch (error) {
    console.log("Error sending message:", error);
  }
};

// Schedule to run every day at 6:00 AM
cron.schedule("0 6 * * *", () => {
  const today = new Date();

  const birthdayPeople = [Tim, Elvis, Princess];
  const todayRecipient = birthdayPeople.find(
    (person) =>
      person.targetDay === today.getDate() &&
      person.targetMonth - 1 === today.getMonth()
  );

  if (todayRecipient) {
    send(todayRecipient.email, emailSubject, next());
  } else {
    console.log("No birthdays today!");
  }
});
