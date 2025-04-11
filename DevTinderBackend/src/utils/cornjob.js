const cron = require("node-cron");
const { subDays, endOfDay, startOfDay } = require("date-fns");
const ConnectionRequest = require("../models/connectionRequestModel");
const sendEmail = require("./sendEmail");

cron.schedule("41 0 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);
    const endDate = endOfDay(yesterday);
    const startDate = startOfDay(yesterday);

    const penddingRequests = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    }).populate("fromUserId toUserId");

    const emailIdsList = [
      ...new Set(penddingRequests.map((req) => req.toUserId.emailId)),
    ];
    console.log(emailIdsList);

    for (const email of emailIdsList) {
      try {
        const htmlTemplate = createEmailTemplate(
          email,
          yesterday.toDateString()
        );

        const resOfSendEmail = await sendEmail.run(
          `New friend requests on ${yesterday.toDateString()}`,
          htmlTemplate
        );

        console.log(resOfSendEmail);
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

const createEmailTemplate = (userEmail, date) => {
  return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #4CAF50;">You've got new friend requests!</h2>
        <p>Hello ${userEmail},</p>
        <p>You received new connection requests on <strong>${date}</strong>.</p>
        <p>Please log in to <a href="https://devtinder.com">devTinder</a> to review them.</p>
        <br />
        <p>Cheers,</p>
        <p>The devTinder Team</p>
      </div>
    `;
};
