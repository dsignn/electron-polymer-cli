import {CommandInterface} from "./CommandInterface";
import {Command} from "commander";
import {ProcessAware} from "../process";
import {AbstractModuleCommand} from "./AbstractModuleCommand";

/**
 *
 */
export class CreateModuleCommand extends AbstractModuleCommand implements CommandInterface {

    description: string = 'Create module';

    name: string = 'create-module --name <name>';

    alias: string = 'crm';

    option: string = '';

    /**
     * @param {string} nameModule
     */
    public action(nameModule : string) {
        /**
         * Validate name module
         */
        if (!this._validateName(nameModule)) {
            const chalk = require('chalk');
            console.log(
                chalk.red.underline.bold(`Invalid name accept "${AbstractModuleCommand.REGEX_NAME}" given "${nameModule}"\n`)
            );
            this.getProcess().exit(1);
        }
        /**
         * Validate current working directory
         */
        if (!this._validateCurrentDirectory(nameModule)) {
            const chalk = require('chalk');
            console.log(
                chalk.red.underline.bold(`Invalid working directory "${this.getProcess().cwd()}" run cli from the root of the project\n`)
            );
            this.getProcess().exit(1);
        }

        if (!this._notExistModule(nameModule)) {
            const chalk = require('chalk');
            console.log(
                chalk.red.underline.bold(`Module already exist "${nameModule}"\n`)
            );
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
        console.log(
            chalk.green.underline.bold(`Module "${nameModule}" created\n`)
        );
    }

    /**
     * @param {string} nameModule
     */
    public templateConfig(nameModule: string) {
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
    public templateEntryPoint(nameModule: string) {
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
    public templatePackageJson(nameModule: string, type: string = 'string') {
        let UcFirstNameModule = nameModule.charAt(0).toUpperCase() + nameModule.slice(1);
        let template =   {
            "title" : UcFirstNameModule.replace(new RegExp('-', 'g'), ' '),
            "name": nameModule,
            "icon" : `${nameModule}:menu`,
            "configEntryPoint": "config.js",
            "entryPoint" : {
                "name" : `${nameModule}-index`,
                "path" : "index.js"
            },
            "autoloadsWs": [
                {
                    "name" : `${nameModule}-icons`,
                    "path" : "element/icons/icons.js"
                }
            ]
        };

        return type === 'string' ? JSON.stringify(template, null, '    ') : template;
    }

    /**
     * @param {string} nameModule
     */
    public templateIcon(nameModule: string) {
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
    protected _updateConfigFiles(name: string) {
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
                fs.writeFileSync(pathFile, JSON.stringify(body, null, '    ') );
            }
        }
    }

    /**
     *
     * @param {string} name
     * @private
     */
    protected _updateImportDev(nameModule) {
        const fs = require('fs');
        const path = require('path');
        const regexp = RegExp(AbstractModuleCommand.REGEX_COMMENT,'g');

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
            fs.writeFileSync(importPathDev, [body.slice(0, index), include, body.slice(index)].join(''));
        }
    }
}
