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
     *
     */
    process() {
        if (!this._process) {
            return;
        }
        this._program.parse(this._process.argv);
    }
    /**
     * @param process
     * @return {string|undefined}
     */
    hasCommandInProcess() {
        let find = undefined;
        if (!this._process) {
            return find;
        }
        for (let cont = 0; this._commands.length > cont; cont++) {
            find = find || this._process.argv.find((element) => {
                switch (true) {
                    case this._commands[cont].name.split(' ')[0] === element:
                    case this._commands[cont].alias === element:
                        find = element;
                        break;
                }
                return find;
            });
        }
        return find;
    }
    /**
     * @return {boolean}
     */
    isThirdParameterOption() {
        let find = false;
        if (!this._process) {
            return find;
        }
        switch (true) {
            case this._process.argv[2].charAt(0) === '-':
            case this._process.argv[2].substring(0, 2) === '--':
                find = true;
                break;
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
            .alias(command.alias)
            .option(command.option)
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
    /**
     * @param process
     * @return {this}
     */
    setProcess(process) {
        this._process = process;
        return this;
    }
    /**
     * @return {any}
     */
    getProcess() {
        return this._process;
    }
    /**
     * @return {commander.Command}
     */
    getProgram() {
        return this._program;
    }
}
exports.Application = Application;
