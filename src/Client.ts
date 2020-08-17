/* eslint-disable no-console */
/* eslint-disable capitalized-comments */
/* eslint-disable multiline-comment-style */
/* eslint-disable max-len */
import Imap from "imap";
import imaps from "imap-simple";
import nodemailer from "nodemailer";
import Constants from "./Constants";
import "./extensions";
import Message from "./Message";
import { notUndefined } from "./utils";

export default class Client {
    makeMail(message: Message): nodemailer.SendMailOptions | undefined {
        if (!message.cc?.includes(Constants.EMAIL_FROM)) {
            return undefined;
        }

        return {
            from: `"${Constants.EMAIL_SENDER}" <${Constants.EMAIL_FROM}>"`,
            to: message.to?.first(),
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

        const drafts = messages.map(this.makeMail).filter(notUndefined);

        const transporter = nodemailer.createTransport({
            host: Constants.SMTP_HOST,
            port: Constants.SMTP_PORT,
            secure: false,
            auth: {
                user: Constants.EMAIL_USERNAME,
                pass: Constants.EMAIL_PASSWORD
            }
        });

        await Promise.all(drafts.map((draft) => transporter.sendMail(draft)));

        transporter.close();
    }

    async connectAndSendMail(imapConfig: Imap.Config) {
        const connection = await imaps.connect({ imap: imapConfig });
        await connection.openBox(Constants.INBOX_NAME);
        await this.sendMail(connection);
        connection.end();
    }

    async start() {
        console.log(Constants.EMAIL_USERNAME);
        const imapConfig: Imap.Config = {
            user: Constants.EMAIL_USERNAME,
            password: Constants.EMAIL_PASSWORD,
            host: Constants.IMAP_HOST,
            port: Constants.IMAP_PORT,
            tls: true,
            authTimeout: 3000
        };
        const config: imaps.ImapSimpleOptions = {
            imap: imapConfig,
            onmail: (numNewMail: number) => {
                this.connectAndSendMail(imapConfig);
            }
        };
        const connection = await imaps.connect(config);
        await connection.openBox(Constants.INBOX_NAME);
    }
}
