export default interface ImapMessage {
    from?: string[]
    to?: string[]
    "reply-to"?: string[]
    cc?: string[]
    subject?: string[]
    date?: string[]
}
