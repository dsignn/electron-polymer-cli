"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("../process");
/**
 *
 */
class CreateModuleCommand extends process_1.ProcessAware {
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
        if (!this._validateName(nameModule)) {
            const chalk = require('chalk');
            console.log(chalk.red.underline.bold(`Invalid name accept "${CreateModuleCommand.REGEX_NAME}" given "${nameModule}"\n`));
            this.getProcess().exit(1);
        }
        /**
         * Validate current working directory
         */
        if (!this._validateCurrentDirectory(nameModule)) {
            const chalk = require('chalk');
            console.log(chalk.red.underline.bold(`Invalid working directory "${this.getProcess().cwd()}" run cli from the root of the project\n`));
            this.getProcess().exit(1);
        }
        if (!this._notExistModule(nameModule)) {
            const chalk = require('chalk');
            console.log(chalk.red.underline.bold(`Module already exist "${nameModule}"\n`));
            this.getProcess().exit(1);
        }
        const fs = require('fs');
        const path = require('path');
        const modulePath = `${this.getModulesPath()}${path.sep}${nameModule}`;
        fs.mkdirSync(`${modulePath}${path.sep}element${path.sep}icons`, { recursive: true });
        fs.writeFileSync(`${modulePath}${path.sep}package.json`, this.templatePackageJson(nameModule));
        fs.writeFileSync(`${modulePath}${path.sep}config.js`, this.templateConfig(nameModule));
        fs.writeFileSync(`${modulePath}${path.sep}index.js`, this.templateEntryPoint(nameModule));
        fs.writeFileSync(`${modulePath}${path.sep}element${path.sep}icons${path.sep}icons.js`, this.templateIcon(nameModule));
        this._updateConfigFiles(nameModule);
        this._updateImportDev(nameModule);
        const chalk = require('chalk');
        console.log(chalk.green.underline.bold(`Module "${nameModule}" created\n`));
    }
    /**
     * @param {string} name
     * @return {boolean}
     * @private
     */
    _validateName(name) {
        let isValid = false;
        const regexp = RegExp(CreateModuleCommand.REGEX_NAME, 'gm');
        if ((regexp.exec(name)) !== null) {
            isValid = true;
        }
        return isValid;
    }
    /**
     * @param name
     * @return {boolean}
     * @private
     */
    _validateCurrentDirectory(name) {
        const fs = require('fs');
        let isValid = false;
        if (fs.existsSync(this.getApplicationPath()) && fs.existsSync(this.getModulesPath())) {
            isValid = true;
        }
        return isValid;
    }
    /**
     * @param name
     * @private
     */
    _notExistModule(name) {
        const fs = require('fs');
        let isValid = true;
        let content = fs.readdirSync(this.getModulesPath());
        for (let cont = 0; content.length > cont; cont++) {
            if (name === content[cont]) {
                isValid = false;
                break;
            }
        }
        return isValid;
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
     */
    templatePackageJson(nameModule, type = 'string') {
        let UcFirstNameModule = nameModule.charAt(0).toUpperCase() + nameModule.slice(1);
        let template = {
            "title": UcFirstNameModule.replace('-', ' '),
            "name": nameModule,
            "icon": `${nameModule}:menu`,
            "configEntryPoint": "config.js",
            "entryPoint": {
                "name": `${nameModule}-index`,
                "path": "index.js"
            },
            "autoloadsWs": [
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
<iron-iconset-svg name="${nameModuleCamelCase}" size="24">
    <svg>
        <defs>
            <g id="menu"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></g>       
        </defs>
    </svg>
</iron-iconset-svg>\`;

document.head.appendChild(template.content);
window.customElements.define('${nameModuleCamelCase}-icons', class ${nameModuleCamelCase.charAt(0).toUpperCase() + nameModuleCamelCase.slice(1)}Icons extends HTMLElement {});
`;
        return template;
    }
    /**
     *
     * @param {string} name
     * @private
     */
    _updateConfigFiles(name) {
        const fs = require('fs');
        const path = require('path');
        let content = fs.readdirSync(this.getConfigPath());
        let body;
        let pathFile;
        for (let cont = 0; content.length > cont; cont++) {
            if (content[cont].startsWith('module')) {
                pathFile = `${this.getConfigPath()}${path.sep}${content[cont]}`;
                body = JSON.parse(fs.readFileSync(pathFile).toString());
                body.push(this.templatePackageJson(name, 'object'));
                fs.writeFileSync(pathFile, JSON.stringify(body, null, '    '));
            }
        }
    }
    _updateImportDev(nameModule) {
        const fs = require('fs');
        const path = require('path');
        let importPathDev = `${this.getApplicationPath()}${path.sep}development${path.sep}dashboard${path.sep}import.js`;
        let body = fs.readFileSync(importPathDev).toString();
        const regexp = RegExp(CreateModuleCommand.REGEX_COMMENT, 'g');
        //let match = body.matchAll(regex);
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
                fs.writeFileSync(importPathDev, [body.slice(0, index), include, body.slice(index)].join(''));
            }
        }
    }
}
CreateModuleCommand.REGEX_NAME = '^[a-z0-9-]*$';
CreateModuleCommand.REGEX_COMMENT = '(\\/\\*[\\w\\\'\\s\\r\\n\\*]*\\*\\/)|(\\/\\/[\\w\\s\\\']*)|(\\<![\\-\\-\\s\\w\\>\\/]*\\>)';
exports.CreateModuleCommand = CreateModuleCommand;
