export default class ModuleTemplate {
    static _getRoot() {
        return `modules/foundry-getting-lost/dist/templates`;
    }

    static _getPath(path: string) {
        return `${ModuleTemplate._getRoot()}/${path}`;
    }
}