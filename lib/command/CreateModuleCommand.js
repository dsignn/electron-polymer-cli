"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("./AbstractCommand");
/**
 *
 */
class CreateModuleCommand extends AbstractCommand_1.AbstractCommand {
    constructor() {
        super(...arguments);
        this.description = 'Create module';
        this.name = 'create-module --name <name>';
        this.alias = 'crm';
        this.option = '';
    }
    /**
     * @param {string} nameModule
     */
    action(nameModule) {
        /**
         * Validate name module
         */
        if (!this.validatorContainer.get('ModuleNameValidation').isValid(nameModule)) {
            this.errorMessage(`Invalid name accept fdfds "${AbstractCommand_1.AbstractCommand.REGEX_NAME_WEB_COMPONENT}" given "${nameModule}"\n`);
        }
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
        if (this.validatorContainer.get('DirectoryExistInPath').isValid(nameModule)) {
            this.errorMessage(`Module already exist "${nameModule}"\n`);
        }
        const fs = require('fs');
        const path = require('path');
        const modulePath = `${this.getModulesPath()}${path.sep}${nameModule}`;
        fs.mkdirSync(`${modulePath}${path.sep}element${path.sep}icons`, { recursive: true });
        fs.writeFileSync(`${modulePath}${path.sep}package.json`, this.templatePackageJson(nameModule));
        fs.writeFileSync(`${modulePath}${path.sep}config.js`, this.templateConfig(nameModule));
        fs.writeFileSync(`${modulePath}${path.sep}index.js`, this.templateEntryPoint(nameModule));
        fs.writeFileSync(`${modulePath}${path.sep}element${path.sep}icons${path.sep}icons.js`, this.templateIcon(nameModule));
        fs.writeFileSync(this.getDevImportPath(), this.updateImportDev(nameModule));
        this._updateConfigFiles(nameModule);
        this.successMessage(`Module "${nameModule}" created\n`);
    }
    /**
     * @param {string} nameModule
     */
    templateConfig(nameModule) {
        const camelCase = require('camelcase');
        let nameModuleCamelCase = camelCase(nameModule);
        let template = `
/**
 * Config file to load services
 */
class ${nameModuleCamelCase.charAt(0).toUpperCase() + nameModuleCamelCase.slice(1)}Config extends require("@dsign/library").container.ContainerAware {
            
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
    /**
     * @param {string} nameModule
     * @param {string} type
     * @return {string | {title: string; name: string; icon: string; configEntryPoint: string; entryPoint: {name: string; path: string}; autoloadsWc: {name: string; path: string}[]}}
     */
    templatePackageJson(nameModule, type = 'string') {
        let UcFirstNameModule = nameModule.charAt(0).toUpperCase() + nameModule.slice(1);
        let template = {
            "title": UcFirstNameModule.replace(new RegExp('-', 'g'), ' '),
            "name": nameModule,
            "icon": `${nameModule}:menu`,
            "configEntryPoint": "config.js",
            "entryPoint": {
                "name": `${nameModule}-index`,
                "path": "index.js"
            },
            "autoloadsWc": [
                {
                    "name": `${nameModule}-icons`,
                    "path": "element/icons/icons.js"
                }
            ]
        };
        return type === 'string' ? JSON.stringify(template, null, '    ') : template;
    }
    /**
     * @param {string} nameModule
     */
    templateIcon(nameModule) {
        const camelCase = require('camelcase');
        let nameModuleCamelCase = camelCase(nameModule);
        let template = `
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-iconset-svg/iron-iconset-svg.js';

import {html} from '@polymer/polymer/lib/utils/html-tag.js';


const template = html\`
<iron-iconset-svg name="${nameModule}" size="24">
    <svg>
        <defs>
            <g id="menu"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></g>       
        </defs>
    </svg>
</iron-iconset-svg>\`;

document.head.appendChild(template.content);
window.customElements.define('${nameModule}-icons', class ${nameModuleCamelCase.charAt(0).toUpperCase() + nameModuleCamelCase.slice(1)}Icons extends HTMLElement {});
`;
        return template;
    }
    /**
     *
     * @param {string} name
     * @private
     */
    _updateConfigFiles(nameModule) {
        const fs = require('fs');
        const path = require('path');
        let content = fs.readdirSync(this.getConfigPath());
        let body;
        let pathFile;
        for (let cont = 0; content.length > cont; cont++) {
            if (content[cont].startsWith('module')) {
                pathFile = `${this.getConfigPath()}${path.sep}${content[cont]}`;
                body = JSON.parse(fs.readFileSync(pathFile).toString());
                body.push(this.templatePackageJson(nameModule, 'object'));
                fs.writeFileSync(pathFile, JSON.stringify(body, null, '    '));
            }
        }
    }
    /**
     * @param {string} nameModule
     * @return string
     */
    updateImportDev(nameModule) {
        const fs = require('fs');
        const path = require('path');
        const regexp = RegExp(AbstractCommand_1.AbstractCommand.REGEX_COMMENT, 'g');
        let importPathDev = `${this.getApplicationPath()}${path.sep}development${path.sep}dashboard${path.sep}import.js`;
        let body = fs.readFileSync(importPathDev).toString();
        let matches;
        let include;
        let index;
        while ((matches = regexp.exec(body)) !== null) {
            if (matches[0].includes('boot application')) {
                index = body.indexOf(matches[0]);
                include =
                    `/**
 * start ${nameModule}
 */
import '../../module/${nameModule}/index'
import '../../module/${nameModule}/element/icons/icons'
/**
 * end ${nameModule}
 */
 
`;
            }
        }
        if (index > 0) {
            body = [body.slice(0, index), include, body.slice(index)].join('');
        }
        return body;
    }
}
exports.CreateModuleCommand = CreateModuleCommand;
