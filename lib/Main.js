"use strict";
/**
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("./Application");
const index_1 = require("./command/index");
class Main {
    /**
     * @param {object} config  package.json object
     */
    constructor(config) {
        this._application = new Application_1.Application(config);
        this._application.addCommand(new index_1.CreateModuleCommand());
        let helpCommand = new index_1.ListCommand();
        this._application.addCommand(helpCommand);
        helpCommand.setCommands(this._application.getCommands());
    }
    /**
     *
     * @param process
     */
    process(process) {
        let cmd = this._application.hasCommandInProcess(process);
        if (cmd === undefined) {
            process.argv.push('list');
        }
        this._application.process(process);
    }
}
exports.Main = Main;
