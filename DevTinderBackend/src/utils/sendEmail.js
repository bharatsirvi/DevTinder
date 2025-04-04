const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesCilent");

const createSendEmailCommand = (
  toAddress,
  fromAddress,
  subject,
  senderName
) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [toAddress],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `${senderName} some action on you`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "this is email text",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async (subject, senderName) => {
  const sendEmailCommand = createSendEmailCommand(
    "bharatsirvi855@gmail.com",
    "bharatsirvi2020@gmail.com",
    subject,
    senderName
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };
