import {CommandInterface} from "./CommandInterface";

/**
 *
 */
export class CreateModuleCommand implements CommandInterface {


    description: string = 'Create command';

    name: string = 'create-module';

    option: string;

    action() {
        console.log('suca con sto modulo');
    }
}
