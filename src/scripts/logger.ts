/* eslint-disable no-console -- module logger: the sanctioned console sink (.claude/rules/code-quality.md) */
class Logger {
    #prefix = 'Getting Lost Helper';

    prefix(message: string) {
        return `${this.#prefix} - ${message}`;
    }

    log(...data: unknown[]) {
        const [message, ...rest] = data;

        if (typeof message === 'string') {
            return console.log(this.prefix(message), ...rest);
        }

        console.log(...data);
    }

    error(...data: unknown[]) {
        const [message, ...rest] = data;

        if (typeof message === 'string') {
            return console.error(this.prefix(message), ...rest);
        }

        console.error(...data);
    }

    warn(...data: unknown[]) {
        const [message, ...rest] = data;

        if (typeof message === 'string') {
            return console.warn(this.prefix(message), ...rest);
        }

        console.warn(...data);
    }
}

export default new Logger();
