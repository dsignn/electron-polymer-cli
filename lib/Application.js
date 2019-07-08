"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Application {
    /**
     * @param {object} config  package.json object
     */
    constructor(config) {
        /**
         *
         * @type {any[]}
         * @private
         */
        this._commands = [];
        /**
         *
         * @type {local.Command}
         * @private
         */
        this._program = new (require('commander')).Command();
        this._program.version(config.version, '-v, --version');
    }
    /**
     * @param {process} process
     */
    process(process) {
        this._program.parse(process.argv);
    }
    /**
     * @param process
     * @return {string|undefined}
     */
    hasCommandInProcess(process) {
        let find = undefined;
        for (let cont = 0; this._commands.length > cont; cont++) {
            find = find || process.argv.find((element) => { return this._commands[cont].name === element; });
        }
        return find;
    }
    /**
     * @param {CommandInterface} command
     * @return {Main}
     */
    addCommand(command) {
        this._program.command(command.name)
            .description(command.description)
            .action(command.action.bind(command));
        this._commands.push(command);
        return this;
    }
    /**
     * @return {Array<CommandInterface>}
     */
    getCommands() {
        return this._commands;
    }
}
exports.Application = Application;
