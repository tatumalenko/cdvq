import he from "he";
import imaps from "imap-simple";
import mimelib from "mimelib";
import Constants from "../Constants";
import { parseEmailAddress, splitByComma } from "../utils/utils";
import ImapMessage from "./ImapMessage";

export default class Message implements ImapMessage {

    from?: string[];

    to?: string[];

    replyTo?: string[];

    cc?: string[];

    subject?: string[];

    date?: string[];

    body?: string;

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
        this.body = Message.sanitize(this.imapMessage?.parts?.first((m) => m.which === "TEXT")?.body);
    }

    public static make(message: imaps.Message) {
        return new Message(message);
    }

    private static makePattern(): RegExp {
        return /<(?<tag>[a-z][a-z0-9]*)[^>]*>(?<content>.*?)<\/\1>/gm;
    }

    private static sanitize(body?: string): string | undefined {
        if (!body) { return undefined; }

        const quotedPrintableDecoded = mimelib.decodeQuotedPrintable(body);

        const matches = quotedPrintableDecoded.match(Message.makePattern());

        type TagContent = {tag: string; content: string};

        const tagContents: TagContent[] = matches
            ?.map((match) => Message.makePattern().exec(match))
            ?.map((regExpExecArray) => {
                const namedGroup = regExpExecArray?.groups;
                if (!namedGroup) {
                    return undefined;
                }
                return namedGroup as TagContent;
            })?.filterNotNone() ?? [];

        return tagContents.reduce((acc, tagContent) => {
            const separator = tagContent.tag.includesAny([ "span" ]) ? Constants.NEWLINE : "";
            const content = tagContent.tag.includesAny([ "b", "span" ]) ? he.decode(tagContent.content) : "";
            return acc + content + separator;
        }, "");
    }
}
