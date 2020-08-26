/* eslint-disable no-console */
/* eslint-disable capitalized-comments */
/* eslint-disable multiline-comment-style */
/* eslint-disable max-len */
import Imap from "imap";
import imaps from "imap-simple";
import nodemailer from "nodemailer";
import "typescript-extensions";
import Constants from "./Constants";
import Rights4VapersFormParser from "./form/Rights4VapersFormParser";
import Rights4VapersSurvey from "./form/Rights4VapersSurvey";
import Message from "./mail/Message";
import Log from "./utils/Log";

process.on("unhandledRejection", (reason, p) => {
    Log.error("Unhandled Rejection at:", p.toString(), "reason:", reason === null ? "" : reason?.toString() ?? "");
    Log.error("Exiting service with status code 1.");
    process.exit(1);
});

export default class Client {
    private readonly formParser = new Rights4VapersFormParser();

    private static stringify(mail: nodemailer.SendMailOptions): string {
        return `from:${mail.from}${Constants.NEWLINE}to:${mail.to}${Constants.NEWLINE}`;
    }

    makeMail(message: Message): nodemailer.SendMailOptions | undefined {
        if (!message.cc?.includes(Constants.EMAIL_FROM)) {
            Log.info(`Message did not contain proper CC address, message.cc=${message.cc}`);
            return undefined;
        }

        if (!message.from?.includes(Constants.EMAIL_CAMPAIGN_FROM)) {
            Log.info(`Message did not originate from campaign sender email, came instead from: ${message.from}`);
        }

        return {
            from: `"${Constants.EMAIL_SENDER}" <${Constants.EMAIL_FROM}>"`,
            to: message.replyTo?.first(),
            subject: Constants.EMAIL_SUBJECT,
            html: Constants.EMAIL_BODY
        };
    }

    async process(connection: imaps.ImapSimple) {
        const searchCriteria = [ "UNSEEN" ];
        const fetchOptions = {
            bodies: [ "HEADER", "TEXT" ],
            markSeen: true
        };
        const messages = (await connection.search(
            searchCriteria,
            fetchOptions
        )).map(Message.make);

        await this.processMessages(messages);
    }

    async processMessages(messages: Message[]) {
        if (messages.filterNotNone().isEmpty()) {
            Log.info("No new unread emails found.");
            return;
        }

        await Promise.all(messages.map((message) => {
            if (message?.from && message?.from.first() === Constants.EMAIL_CAMPAIGN_FROM) {
                return this.sendMail(message);
            } else if (message?.from && message?.from.first() === Constants.EMAIL_SURVEY_FROM) {
                return this.sendSurvey(message);
            }

            return undefined;
        })
            .filterNotNone());
    }

    async sendMail(message: Message) {
        const draft = this.makeMail(message);

        if (!draft) {
            Log.info("No draft was created.");
            return;
        }

        Log.info("Preparing to send drafts:", Client.stringify(draft));

        const transporter = nodemailer.createTransport({
            host: Constants.SMTP_HOST,
            port: Constants.SMTP_PORT,
            secure: false,
            auth: {
                user: Constants.EMAIL_SMTP_USERNAME,
                pass: Constants.EMAIL_SMTP_PASSWORD
            }
        });

        await transporter.sendMail(draft);

        Log.info("Draft sent.");

        transporter.close();
    }

    async sendSurvey(message: Message) {
        if (!message?.body) {
            return;
        }

        const keyValues = this.formParser.process(message.body);

        const survey = new Rights4VapersSurvey(keyValues);

        Log.info(`Submitting survey with form fields: ${survey.stringify()}`);

        const response = await survey.send();

        if (response.success) {
            Log.info("Survey was successfully sent.");
        } else {
            Log.error("Survey was not successfully sent. Reponse body:", response.body);
        }
    }

    async connectAndProcess(imapConfig: Imap.Config) {
        const connection = await imaps.connect({ imap: imapConfig });
        await connection.openBox(Constants.INBOX_NAME);
        await this.process(connection);
        connection.end();
    }

    async start() {
        try {
            const imapConfig: Imap.Config = {
                user: Constants.EMAIL_IMAP_USERNAME,
                password: Constants.EMAIL_IMAP_PASSWORD,
                host: Constants.IMAP_HOST,
                port: Constants.IMAP_PORT,
                tls: true,
                authTimeout: 3000
            };
            const config: imaps.ImapSimpleOptions = {
                imap: imapConfig,
                onmail: (numNewMail: number) => {
                    if (numNewMail > 0) {
                        Log.info(`New mail received: ${numNewMail}`);
                    }
                    this.connectAndProcess(imapConfig);
                }
            };
            const connection = await imaps.connect(config);
            await connection.openBox(Constants.INBOX_NAME);
        } catch (e) {
            Log.error(e);
        }
    }
}
