"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
class CreateModuleCommand {
    constructor() {
        this.description = 'Create command';
        this.name = 'create-module';
    }
    action() {
        console.log('suca con sto modulo');
    }
}
exports.CreateModuleCommand = CreateModuleCommand;
