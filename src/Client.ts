/* eslint-disable no-console */
/* eslint-disable capitalized-comments */
/* eslint-disable multiline-comment-style */
/* eslint-disable max-len */
import Imap from "imap";
import imaps from "imap-simple";
import nodemailer from "nodemailer";
import Constants from "./Constants";
import "./extensions";
import Log from "./Log";
import Message from "./Message";
import { notUndefined } from "./utils";

process.on("unhandledRejection", (reason, p) => {
    Log.error("Unhandled Rejection at:", p.toString(), "reason:", reason === null ? "" : reason?.toString() ?? "");
    Log.error("Exiting service with status code 1.");
    process.exit(1);
});

export default class Client {
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

    async sendMail(connection: imaps.ImapSimple) {
        const searchCriteria = [ "UNSEEN" ];
        const fetchOptions = {
            bodies: [ "HEADER", "TEXT" ],
            markSeen: true
        };
        const messages = (await connection.search(
            searchCriteria,
            fetchOptions
        )).map(Message.make);

        if (messages.filter(notUndefined).length === 0) {
            Log.info("No new unread emails found.");
            return;
        }

        const drafts = messages.map(this.makeMail).filter(notUndefined);

        if (drafts.length === 0) {
            Log.info("No new messages were created.");
            return;
        }

        Log.info("Preparing to send drafts:", drafts.reduce((acc, draft) => `${acc}${Constants.NEWLINE}${Client.stringify(draft)}`, ""));

        const transporter = nodemailer.createTransport({
            host: Constants.SMTP_HOST,
            port: Constants.SMTP_PORT,
            secure: false,
            auth: {
                user: Constants.EMAIL_SMTP_USERNAME,
                pass: Constants.EMAIL_SMTP_PASSWORD
            }
        });

        await Promise.all(drafts.map((draft) => transporter.sendMail(draft)));

        Log.info("Drafts sent.");

        transporter.close();
    }

    async connectAndSendMail(imapConfig: Imap.Config) {
        const connection = await imaps.connect({ imap: imapConfig });
        await connection.openBox(Constants.INBOX_NAME);
        await this.sendMail(connection);
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
                    this.connectAndSendMail(imapConfig);
                }
            };
            const connection = await imaps.connect(config);
            await connection.openBox(Constants.INBOX_NAME);
        } catch (e) {
            Log.error(e);
        }
    }
}
