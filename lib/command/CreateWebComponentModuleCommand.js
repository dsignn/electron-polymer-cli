"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("./AbstractCommand");
class CreateWebComponentModuleCommand extends AbstractCommand_1.AbstractCommand {
    constructor() {
        super(...arguments);
        this.description = 'Create webcomponent into the module';
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
        this.validatorContainer.get('DirectoryExistInPath').setDefaultPath(this.getModulesPath());
        if (!this.validatorContainer.get('DirectoryExistInPath').isValid(nameModule)) {
            this.errorMessage(`Module not exist "${nameModule}"\n`);
        }
        /**
         * Check the name of web component
         */
        if (!this.validatorContainer.get('WebComponentNameValidation').isValid(nameWebComponent)) {
            this.errorMessage(`Wrong name of web component "${nameWebComponent}"\n`);
        }
        // TODO check if exist wc
        const moduleElementsPath = this.getWebComponentPath(nameModule, nameWebComponent);
        /**
         * Check if the module exist
         */
        this.validatorContainer.get('DirectoryExistInPath').setDefaultPath(moduleElementsPath);
        if (this.validatorContainer.get('DirectoryExistInPath').isValid(`${nameWebComponent}.js`)) {
            this.errorMessage(`Web component already exist "${nameWebComponent}" in module "${nameModule}"\n`);
        }
        const fs = require('fs');
        const path = require('path');
        fs.mkdirSync(this.getWebComponentPath(nameModule, nameWebComponent));
        fs.writeFileSync(`${this.getWebComponentPath(nameModule, nameWebComponent)}${path.sep}${nameWebComponent}.js`, this.templateWebComponent(nameWebComponent));
        fs.writeFileSync(`${this.getModulePath(nameModule)}${path.sep}package.json`, this.integratePackageJson(nameModule, nameWebComponent));
        fs.writeFileSync(this.getDevImportPath(), this.updateImportDev(nameModule, nameWebComponent));
        this._updateConfigFiles(nameModule, nameWebComponent);
        this.successMessage(`Create web component "${nameWebComponent}" on module ${nameModule}\n`);
    }
    /**
     * @param {string} nameWebComponent
     * @return string
     */
    templateWebComponent(nameWebComponent) {
        const camelCase = require('camelcase');
        let nameWebComponentCamelCase = camelCase(nameWebComponent);
        let template = `
import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
/**
 * Entry point for the module ${nameWebComponentCamelCase}
 *
 * @customElement
 * @polymer
 */
class ${nameWebComponentCamelCase.charAt(0).toUpperCase() + nameWebComponentCamelCase.slice(1)}Element extends PolymerElement {
    static get template() {
        return html\`
            ${nameWebComponent}
        \`;
    }
}
window.customElements.define("${nameWebComponent}", ${nameWebComponentCamelCase.charAt(0).toUpperCase() + nameWebComponentCamelCase.slice(1)}Element);
`;
        return template;
    }
    /**
     * @param {string} nameModule
     * @param {string} nameWebComponent
     * @return object
     */
    integratePackageJson(nameModule, nameWebComponent) {
        const fs = require('fs');
        const path = require('path');
        let contentPackage = JSON.parse(fs.readFileSync(`${this.getModulesPath()}${path.sep}${nameModule}${path.sep}package.json`).toString());
        let wsObject = {
            name: nameWebComponent,
            path: `element${path.sep}${nameWebComponent}${path.sep}${nameWebComponent}.js`
        };
        contentPackage.autoloadsWc.push(wsObject);
        return JSON.stringify(contentPackage, null, '    ');
    }
    /**
     * @param {string} nameModule
     * @param {string} nameWebComponent
     * @return {string}
     */
    updateImportDev(nameModule, nameWebComponent) {
        const fs = require('fs');
        const path = require('path');
        const regexp = RegExp(AbstractCommand_1.AbstractCommand.REGEX_COMMENT, 'g');
        let importPathDev = `${this.getApplicationPath()}${path.sep}development${path.sep}dashboard${path.sep}import.js`;
        let body = fs.readFileSync(importPathDev).toString();
        let matches;
        let include;
        let index;
        while ((matches = regexp.exec(body)) !== null) {
            if (matches[0].includes(`end ${nameModule}`)) {
                index = body.indexOf(matches[0]);
                include = `import '..${path.sep}..${path.sep}module${path.sep}${nameModule}${path.sep}element${path.sep}${nameWebComponent}${path.sep}${nameWebComponent}'\n`;
                break;
            }
        }
        if (index > 0) {
            body = [body.slice(0, index), include, body.slice(index)].join('');
        }
        return body;
    }
    /**
     * @param {string} nameModule
     * @param {string} nameWebComponent
     * @param {string} relativePath
     * @private
     */
    _updateConfigFiles(nameModule, nameWebComponent) {
        const fs = require('fs');
        const path = require('path');
        let content = fs.readdirSync(this.getConfigPath());
        let body;
        let pathFile;
        for (let cont = 0; content.length > cont; cont++) {
            if (content[cont].startsWith('module')) {
                pathFile = `${this.getConfigPath()}${path.sep}${content[cont]}`;
                body = JSON.parse(fs.readFileSync(pathFile).toString());
                let wsObject = {
                    name: nameWebComponent,
                    path: `element${path.sep}${nameWebComponent}${path.sep}${nameWebComponent}.js`
                };
                for (let cont = 0; body.length > cont; cont++) {
                    if (body[cont].name === nameModule) {
                        body[cont].autoloadsWc.push(wsObject);
                    }
                }
                fs.writeFileSync(pathFile, JSON.stringify(body, null, '    '));
            }
        }
    }
}
exports.CreateWebComponentModuleCommand = CreateWebComponentModuleCommand;
