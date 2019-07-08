/**
 *
 */
import {Command} from "commander";
import {CommandInterface} from "./command/CommandInterface";

export class Application {

    /**
     *
     * @type {any[]}
     * @private
     */
    private _commands: Array<CommandInterface> = [];

    /**
     *
     * @type {local.Command}
     * @private
     */
    private _program: Command = new (require('commander')).Command();

    /**
     * @param {object} config  package.json object
     */
    constructor(config) {
        this._program.version(config.version, '-v, --version');
    }

    /**
     * @param {process} process
     */
    process(process: any) {
        this._program.parse(process.argv);
    }

    /**
     * @param process
     * @return {string|undefined}
     */
    hasCommandInProcess(process: any) {
       let find = undefined;
       for (let cont = 0; this._commands.length > cont; cont++) {
           find = find || process.argv.find((element) => { return this._commands[cont].name === element })
       }

       return find;
    }

    /**
     * @param {CommandInterface} command
     * @return {Main}
     */
    addCommand(command: CommandInterface) {

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
