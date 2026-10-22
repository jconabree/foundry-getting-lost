class Logger {
    #prefix = 'Getting Lost Helper';

    prefix(message: string) {
        return `${this.#prefix} - ${message}`;
    }

    log(...data: unknown[]) {
        const [message, ...rest] = data;

        if (typeof message === 'string') {
            // eslint-disable-next-line no-console -- legacy: see CLAUDE.md "Known legacy patterns"
            return console.log(this.prefix(message), ...rest);
        }

        // eslint-disable-next-line no-console -- legacy: see CLAUDE.md "Known legacy patterns"
        console.log(...data);
    }

    error(...data: unknown[]) {
        const [message, ...rest] = data;

        if (typeof message === 'string') {
            // eslint-disable-next-line no-console -- legacy: see CLAUDE.md "Known legacy patterns"
            return console.error(this.prefix(message), ...rest);
        }

        // eslint-disable-next-line no-console -- legacy: see CLAUDE.md "Known legacy patterns"
        console.error(...data);
    }

    warn(...data: unknown[]) {
        const [message, ...rest] = data;

        if (typeof message === 'string') {
            // eslint-disable-next-line no-console -- legacy: see CLAUDE.md "Known legacy patterns"
            return console.warn(this.prefix(message), ...rest);
        }

        // eslint-disable-next-line no-console -- legacy: see CLAUDE.md "Known legacy patterns"
        console.warn(...data);
    }
}

export default new Logger();
