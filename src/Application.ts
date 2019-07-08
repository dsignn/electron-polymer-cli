/**
 *
 */
import {Command} from "commander";
import {CommandInterface} from "./command/CommandInterface";
import {ProcessAware, ProcessAwareInterface} from "./process";

export class Application extends ProcessAware implements ProcessAwareInterface {

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
     *
     * @param {object} config  package.json object
     * @param process
     */
    constructor(config, process) {
        super();
        this._program.version(config.version, '-v, --version');
        this.setProcess(process);
    }

    /**
     *
     */
    execProcess() {
        if (!this.process) {
            return;
        }
        this._program.parse(this.getProcess().argv);
    }

    /**
     * @param process
     * @return {string|undefined}
     */
    hasCommandInProcess() {
       let find = undefined;

       if (!this.process) {
           return find;
       }

       for (let cont = 0; this._commands.length > cont; cont++) {

           find = find || this.getArgs().find((element) => {

               switch (true) {
                   case this._commands[cont].name.split(' ')[0] === element:
                   case this._commands[cont].alias === element:
                       find = element;
                       break;
               }

               return find;
           })
       }

       return find;
    }

    /**
     * @return {boolean}
     */
    isThirdParameterOption() {
        let find = false;

        if (!this.process) {
            return find;
        }

        switch (true) {
            case this.getArgsByIndex(2) !== null && this.getArgsByIndex(2).charAt(0) === '-':
            case this.getArgsByIndex(2) !== null && this.getArgsByIndex(2).substring(0,2) === '--':
                find = true;
                break
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
     * @return {commander.Command}
     */
    getProgram() {
        return this._program;
    }
}
