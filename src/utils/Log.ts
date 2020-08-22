import Constants from "../Constants";
/* eslint-disable no-console */
import { isError } from "./utils";

export default class Log {
    public static info(...args: (string | Error)[]): void {
        console.info(Log.format(...args));
    }

    public static error(...args: (string | Error)[]): void {
        console.error(Log.format(...args));
    }

    private static format(...args: (string | Error)[]): string {
        return args.reduce((acc, arg, index) => acc + (index !== 0 ? Constants.NEWLINE : "") +
            (isError(arg) ? (arg.stack ?? arg.message) : arg), "") as string;
    }
}
