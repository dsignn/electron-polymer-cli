"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
class CreateModuleCommand {
    constructor() {
        this.description = 'Create command';
        this.name = 'create-module --name <name>';
        this.alias = 'crc';
        this.option = '-t, --test <test>';
    }
    /**
     * @param cmd
     */
    action(cmd) {
        console.log('suca con sto modulo', cmd.g);
    }
}
exports.CreateModuleCommand = CreateModuleCommand;
