import {CommandInterface} from "./CommandInterface";
import {Command} from "commander";

/**
 *
 */
export class CreateModuleCommand implements CommandInterface {


    description: string = 'Create command';

    name: string = 'create-module --name <name>';

    alias: string = 'crc';

    option: string = '-t, --test <test>';

    /**
     * @param cmd
     */
    action(cmd : Command) {
        console.log('suca con sto modulo', cmd.g);
    }
}
