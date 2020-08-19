import imaps from "imap-simple";
import ImapMessage from "./ImapMessage";
import { parseEmailAddress, splitByComma } from "./utils";

export default class Message implements ImapMessage {

    from?: string[];

    to?: string[];

    replyTo?: string[];

    cc?: string[];

    subject?: string[];

    date?: string[];

    private static readonly HEADER = "HEADER";

    private readonly imapMessage: imaps.Message;

    private readonly imapBody?: ImapMessage;

    constructor(readonly message: imaps.Message) {
        this.imapMessage = message;
        this.imapBody = message.parts.first((m) => m.which === Message.HEADER)?.body;
        this.from = this.imapBody?.from?.flatMap(splitByComma)?.map(parseEmailAddress);
        this.to = this.imapBody?.to?.flatMap(splitByComma)?.map(parseEmailAddress);
        this.replyTo = this.imapBody?.["reply-to"]?.flatMap(splitByComma)?.map(parseEmailAddress);
        this.cc = this.imapBody?.cc?.flatMap(splitByComma)?.map(parseEmailAddress);
        this.subject = this.imapBody?.subject;
        this.date = this.imapBody?.date;
    }

    public static make(message: imaps.Message) {
        return new Message(message);
    }
}
