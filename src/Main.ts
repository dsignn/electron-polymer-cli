/**
 *
 */

import {Application} from "./Application";
import {CreateModuleCommand, ListCommand} from "./command/index";
export class Main {

    /**
     * @type {Application}
     * @private
     */
    private _application: Application;

    /**
     * @param {object} config  package.json object
     */
    constructor(config) {

        this._application = new Application(config);

        this._application.addCommand(new CreateModuleCommand());
        let helpCommand = new ListCommand();
        this._application.addCommand(helpCommand);
        helpCommand.setCommands(this._application.getCommands());
    }

    /**
     *
     * @param process
     */
    process(process: any) {

        let cmd = this._application.hasCommandInProcess(process);

        if (cmd === undefined) {
            process.argv.push('list');
        }

        this._application.process(process);
    }
}
