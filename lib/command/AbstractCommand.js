"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("../process");
/**
 *
 */
class AbstractCommand extends process_1.ProcessAware {
    /**
     * @param {ContainerInterface} validatorContainer
     */
    constructor(validatorContainer) {
        super();
        this.validatorContainer = validatorContainer;
    }
    /**
     * @param {string} message
     */
    errorMessage(message) {
        const chalk = require('chalk');
        console.log(chalk.red.underline.bold(message));
        this.getProcess().exit(1);
    }
    /**
     * @param {string} message
     */
    successMessage(message) {
        const chalk = require('chalk');
        console.log(chalk.green.underline.bold(message));
    }
    /**
     * @param {string} nameModule
     * @return {string}
     */
    getModulePath(nameModule) {
        const path = require('path');
        return `${this.getModulesPath()}${path.sep}${nameModule}`;
    }
    /**
     * @param {string} nameModule
     * @param {string} nameWebComponent
     * @return {string}
     */
    getWebComponentPath(nameModule, nameWebComponent) {
        const path = require('path');
        return `${this.getModulesPath()}${path.sep}${nameModule}${path.sep}element${path.sep}${nameWebComponent}`;
    }
    /**
     * @return {string}
     */
    getDevImportPath() {
        const path = require('path');
        return `${this.getApplicationPath()}${path.sep}development${path.sep}dashboard${path.sep}import.js`;
    }
    /**
     * @param {string} nameModule
     * @return {string}
     */
    getModuleSrcPath(nameModule) {
        const path = require('path');
        return `${this.getModulePath(nameModule)}${path.sep}src`;
    }
}
exports.AbstractCommand = AbstractCommand;
AbstractCommand.REGEX_NAME_MODULE = '^[a-z0-9-]*$';
AbstractCommand.REGEX_NAME_WEB_COMPONENT = '^[a-z0-9-]+(-)([a-z0-9-]+)$';
AbstractCommand.REGEX_NAME_CLASS = '^[a-zA-Z0-9]+$';
AbstractCommand.REGEX_COMMENT = '(\\/\\*[\\w\\\'\\s\\r\\n\\-*]*\\*\\/)|(\\/\\/[\\w\\s\\\']*)|(\\<![\\-\\-\\s\\w\\>\\/]*\\>)';
