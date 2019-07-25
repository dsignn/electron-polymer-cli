"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("../process");
/**
 *
 */
class AbstractModuleCommand extends process_1.ProcessAware {
    // /**
    //  *
    //  * @param {string} nameModule
    //  */
    // public abstract action(nameModule: string);
    /**
     * @param {string} name
     * @return {boolean}
     * @private
     */
    _validateName(name) {
        let isValid = false;
        const regexp = RegExp(AbstractModuleCommand.REGEX_NAME, 'gm');
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
}
AbstractModuleCommand.REGEX_NAME = '^[a-z0-9-]*$';
AbstractModuleCommand.REGEX_COMMENT = '(\\/\\*[\\w\\\'\\s\\r\\n\\-*]*\\*\\/)|(\\/\\/[\\w\\s\\\']*)|(\\<![\\-\\-\\s\\w\\>\\/]*\\>)';
exports.AbstractModuleCommand = AbstractModuleCommand;
