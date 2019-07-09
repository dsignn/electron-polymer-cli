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

        this._exist(nameModule);
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

    _exist(name) {
        const fs = require('fs');
        console.log(name, __dirname)
        console.log(name, this.getProcess().cwd())
    }

    /**
     * @param {string} nameModule
     */
    templateConfig(nameModule: string) {
        const camelCase = require('camelcase');
        let nameModuleCamelCase = camelCase(nameModule);

        let template = `
            /**
             *
             */
            class ${nameModuleCamelCase.charAt(0).toUpperCase() + nameModuleCamelCase.slice(1)}Config extends require("@fluidnext/library").container.ContainerAware {
            
                init() {

                    console.log('Init ${nameModule}');
                }
            }
            module.exports = ${nameModuleCamelCase.charAt(0).toUpperCase() + nameModuleCamelCase.slice(1)}Config;
        `;
        return template;
    }

    /**
     * @param {string} nameModule
     */
    templateEntryPoint(nameModule: string) {
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
                window.customElements.define(${nameModule}-index, ${nameModuleCamelCase.charAt(0).toUpperCase() + nameModuleCamelCase.slice(1)}Index);
        `;
        return template;
    }

    /**
     * @param {string} nameModule
     */
    templatePackageJson(nameModule: string) {
        let UcFirstNameModule = nameModule.charAt(0).toUpperCase() + nameModule.slice(1);
        let template =   {
            "title" : UcFirstNameModule.replace('-', ' '),
            "name": nameModule,
            "icon" : `${nameModule}:menu`,
            "configEntryPoint": "config.js",
            "entryPoint" : {
                "name" : `${nameModule}-index`,
                "path" : "index.js"
            }
        }
    }
}
