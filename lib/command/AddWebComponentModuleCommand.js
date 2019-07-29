"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("./AbstractCommand");
class AddWebComponentModuleCommand extends AbstractCommand_1.AbstractCommand {
    constructor() {
        super(...arguments);
        this.description = 'Add Webcomponent';
        this.name = 'create-webcomponent --moduleName <moduleName> --webcomponentName <webcomponentName>';
        this.alias = 'crw';
        this.option = '';
    }
    /**
     *
     * @param {String} nameModule Name of the module
     * @param {String} nameWebComponent Name for the New class
     */
    action(nameModule, nameWebComponent) {
        /**
         * Validate current working directory
         */
        if (!this.validatorContainer.get('DirectoryExist').isValid([this.getApplicationPath(), this.getModulesPath()])) {
            this.errorMessage(`Invalid working directory "${this.getProcess().cwd()}" run cli from the root of the project\n`);
        }
        /**
         * Check if the module exist
         */
        this.validatorContainer.get('DirectoryExistInPath').setDefaultPath('/home/visa/Project/3.0fluild/electron-polymer/app/module');
        if (!this.validatorContainer.get('DirectoryExistInPath').isValid(nameModule)) {
            this.errorMessage(`Module not exist "${nameModule}"\n`);
        }
        /**
         * Check the name of web component
         */
        if (!this.validatorContainer.get('WebComponentNameValidation').isValid(nameWebComponent)) {
            this.errorMessage(`Wrong name of web component "${nameWebComponent}"\n`);
        }
        const fs = require('fs');
        const path = require('path');
        const modulePath = `${this.getModulesPath()}${path.sep}${nameModule}`;
        console.warn(modulePath);
        console.warn(nameModule);
        console.warn(nameWebComponent);
    }
    /**
     * @param {string} nameModule
     */
    templateEntryPoint(nameModule) {
        const camelCase = require('camelcase');
        let nameModuleCamelCase = camelCase(nameModule);
        let template = `
import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
/**
 * Entry point for the module ${nameModuleCamelCase}
 *
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
window.customElements.define("${nameModule}-index", ${nameModuleCamelCase.charAt(0).toUpperCase() + nameModuleCamelCase.slice(1)}Index);
`;
        return template;
    }
}
exports.AddWebComponentModuleCommand = AddWebComponentModuleCommand;
