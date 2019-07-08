import {CommandInterface} from "./CommandInterface";
import {ProcessAware} from "../process";

/**
 *
 */
export class ListCommand extends ProcessAware implements CommandInterface {


    description: string = 'List command';

    name: string = 'list';

    alias: string = 'li';

    option: string = '';

    private _commands: Array<CommandInterface>;

    action() {

        const chalk = require('chalk');
        const figlet = require('figlet');

        console.log(
            chalk.green(
                figlet.textSync('FLUID NEXT',
                    {
                        font : "3D Diagonal",
                        horizontalLayout: 'full'
                    }
                )
            )
        );


        console.log(chalk.green.underline.bold('List commamd\n'));

        for(let cont = 0; this._commands.length > cont; cont++) {
            console.log(`    ${this._commands[cont].name}: ${this._commands[cont].description}`);
        }

        console.log(chalk.underline('\n'));
    }

    /**
     * @param {Array<CommandInterface>} commands
     * @return {this}
     */
    setCommands(commands: Array<CommandInterface>) {
        this._commands = commands;
        return this;
    }

}
