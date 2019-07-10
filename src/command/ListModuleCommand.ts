import {CommandInterface} from "./CommandInterface";

import {ProcessAware} from "../process";
import {AbstractModuleCommand} from "./AbstractModuleCommand";

/**
 *
 */
export class ListModuleCommand extends AbstractModuleCommand implements CommandInterface {


    description: string = 'List command';

    name: string = 'list-module';

    alias: string = 'lim';

    option: string = '';

    action(nameModule: string) {

        /**
         * Validate current working directory
         */
        if (!this._validateCurrentDirectory(nameModule)) {
            const chalk = require('chalk');
            console.log(
                chalk.red.underline.bold(`Invalid working directory "${this.getProcess().cwd()}" run cli from the root of the project\n`)
            );
            this.getProcess().exit(1);
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
