class Logger {
    #prefix = '{{MODULE_NAME}} - ';

    prefix(message: string) {
        return `${this.#prefix} - ${message}`;
    }

    log(...data: any[]) {
        const [message, ...rest] = data;

        if (typeof message === 'string') {
            return console.log(this.prefix(message), ...rest);
        }

        console.log(...data);
    }

    error(...data: any[]) {
        const [message, ...rest] = data;

        if (typeof message === 'string') {
            return console.error(this.prefix(message), ...rest);
        }

        console.error(...data);
    }

    warn(...data: any[]) {
        const [message, ...rest] = data;

        if (typeof message === 'string') {
            return console.warn(this.prefix(message), ...rest);
        }

        console.warn(...data);
    }
}

export default new Logger();