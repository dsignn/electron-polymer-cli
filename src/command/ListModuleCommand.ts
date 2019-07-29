import {CommandInterface} from "./CommandInterface";
import {AbstractCommand} from "./AbstractCommand";

/**
 *
 */
export class ListModuleCommand extends AbstractCommand implements CommandInterface {


    description: string = 'List command';

    name: string = 'list-module';

    alias: string = 'lim';

    option: string = '';

    action(nameModule: string) {

        /**
         * Validate current working directory
         */
        if (!this.validatorContainer.get('DirectoryExist').isValid([this.getApplicationPath(), this.getModulesPath()])) {
            this.errorMessage(`Invalid working directory "${this.getProcess().cwd()}" run cli from the root of the project\n`);
        }

        const fs = require('fs');
        const path = require('path');
        let body = JSON.parse(fs.readFileSync(`${this.getConfigPath()}${path.sep}module.json`).toString());

        const chalk = require('chalk');

        console.log(
            chalk.green.underline.bold(`List modules\n`)
        );

        for (let cont = 0;  body.length > cont; cont++) {
            console.log(`    ${body[cont].name}`);
        }
    }
}
