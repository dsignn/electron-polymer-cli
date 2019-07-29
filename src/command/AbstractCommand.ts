import {ProcessAware} from "../process";

/**
 *
 */
export abstract class AbstractCommand extends ProcessAware {

    static REGEX_NAME_MODULE = '^[a-z0-9-]*$';

    static REGEX_NAME_WEB_COMPONENT = '^[a-z0-9-]+(-)([a-z0-9-]+)$';

    static REGEX_NAME_CLASS = '^[a-zA-Z0-9]+$';

    static REGEX_COMMENT = '(\\/\\*[\\w\\\'\\s\\r\\n\\-*]*\\*\\/)|(\\/\\/[\\w\\s\\\']*)|(\\<![\\-\\-\\s\\w\\>\\/]*\\>)';

    protected validatorContainer: any;

    /**
     * @param {ContainerInterface} validatorContainer
     */
    public constructor(validatorContainer: any) {
        super();
        this.validatorContainer = validatorContainer
    }

    /**
     * @param {string} message
     */
    protected errorMessage(message: string) {
        const chalk = require('chalk');
        console.log(
            chalk.red.underline.bold(message)
        );

        this.getProcess().exit(1);
    }

    /**
     * @param {string} message
     */
    protected successMessage(message: string) {
        const chalk = require('chalk');
        console.log(
            chalk.green.underline.bold(message)
        );
    }

    /**
     * @param {string} nameModule
     * @return {string}
     */
    protected getModulePath(nameModule: string) {
        const path = require('path');
        return  `${this.getModulesPath()}${path.sep}${nameModule}`;
    }

    /**
     * @param {string} nameModule
     * @param {string} nameWebComponent
     * @return {string}
     */
    protected getWebComponentPath(nameModule: string, nameWebComponent: string) {
        const path = require('path');
        return  `${this.getModulesPath()}${path.sep}${nameModule}${path.sep}element${path.sep}${nameWebComponent}`;
    }

    /**
     * @return {string}
     */
    protected getDevImportPath() {
        const path = require('path');
        return `${this.getApplicationPath()}${path.sep}development${path.sep}dashboard${path.sep}import.js`;
    }

    /**
     * @param {string} nameModule
     * @return {string}
     */
    protected getModuleSrcPath(nameModule: string) {
        const path = require('path');
        return  `${this.getModulePath(nameModule)}${path.sep}src`;
    }
}
