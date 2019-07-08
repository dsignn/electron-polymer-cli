import {CommandInterface} from "./CommandInterface";
import {Command} from "commander";
import {ProcessAware} from "../process";

/**
 *
 */
export class CreateModuleCommand extends ProcessAware implements CommandInterface {

    static REGEX = /^[a-z0-9-]*$/gm;

    description: string = 'Create command';

    name: string = 'create-module --name <name>';

    alias: string = 'crm';

    option: string = '-t, --test <test>';

    /**
     * @param {string} nameModule
     */
    action(nameModule : string) {
        if (!this._validateName(nameModule)) {
            const chalk = require('chalk');
            console.log(
                chalk.red.underline.bold(`Invalid name accept "${CreateModuleCommand.REGEX}" given "${nameModule}"\n`)
            );
            this.getProcess().exit(1);
        }
        console.log(this.templateConfig(nameModule));
        console.log(nameModule);
    }

    /**
     * @param {string} name
     * @return {boolean}
     * @private
     */
    _validateName(name) {
        let isValid = false;
        if ((CreateModuleCommand.REGEX.exec(name)) !== null) {
            isValid = true;
        }
        return isValid
    }

    /**
     * @param {string} nameModule
     */
    templateIndex(nameModule: string) {

    }

    /**
     * @param {string} nameModule
     */
    templateConfig(nameModule: string) {
        const camelCase = require('camelcase');
        let nameModuleCamelCase = camelCase(nameModule);

        let template = `
                import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
                /**
                 * @customElement
                 * @polymer
                 */
                class ${nameModuleCamelCase.charAt(0).toUpperCase() + nameModuleCamelCase.slice(1)}Index extends PolymerElement {
                    static get template() {
                        return html\`
                           ${nameModule}
                        \`;
                    }
                }
                window.customElements.define(${nameModule}, ${nameModuleCamelCase.charAt(0).toUpperCase() + nameModuleCamelCase.slice(1)}Index);
        `
        return template;
    }
}
