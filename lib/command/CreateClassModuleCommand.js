"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("./AbstractCommand");
class CreateClassModuleCommand extends AbstractCommand_1.AbstractCommand {
    constructor() {
        super(...arguments);
        this.description = 'Create class into the module';
        this.name = 'create-class --moduleName <moduleName> --className <className>';
        this.alias = 'crc';
        this.option = '';
    }
    // TODO add optional sub path
    /**
     * @param {string} nameModule
     * @param {string} nameClass
     */
    action(nameModule, nameClass) {
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
        if (!this.validatorContainer.get('ClassNameValidation').isValid(nameClass)) {
            this.errorMessage(`Wrong name of web component "${nameClass}"\n`);
        }
        let moduleSrcPath = this.getModuleSrcPath(nameModule);
        /**
         * Check if the module exist
         */
        this.validatorContainer.get('DirectoryExistInPath').setDefaultPath(moduleSrcPath);
        if (this.validatorContainer.get('DirectoryExistInPath').isValid(`${nameClass}.js`)) {
            this.errorMessage(`Web component already exist "${nameClass}" in module "${nameModule}"\n`);
        }
        const fs = require('fs');
        const path = require('path');
        fs.writeFileSync(`${this.getModuleSrcPath(nameModule)}${path.sep}${nameClass}.js`, this.templateClass(nameClass));
        fs.writeFileSync(`${this.getModulePath(nameModule)}${path.sep}package.json`, this.integratePackageJson(nameModule, nameClass));
        this._updateConfigFiles(nameModule, nameClass);
        this.successMessage(`Create class "${nameClass}" on module ${nameModule}\n`);
    }
    /**
     * @param {string} nameClass
     * @return string
     */
    templateClass(nameClass) {
        let template = `
/**
 * @class ${nameClass}
 */
class ${nameClass} {

} 

module.exports = ${nameClass};
`;
        return template;
    }
    /**
     * @param {string} nameModule
     * @param {string} nameClass
     * @param {string} relativePath
     * @return {string}
     */
    integratePackageJson(nameModule, nameClass, relativePath) {
        const fs = require('fs');
        const path = require('path');
        let contentPackage = JSON.parse(fs.readFileSync(`${this.getModulesPath()}${path.sep}${nameModule}${path.sep}package.json`).toString());
        relativePath = relativePath ? relativePath : '';
        let classSrc = `src${path.sep}${relativePath}${nameClass}.js`;
        contentPackage.autoloads.push(classSrc);
        return JSON.stringify(contentPackage, null, '    ');
    }
    /**
     * @param {string} nameModule
     * @param {string} nameClass
     * @param {string} relativePath
     * @private
     */
    _updateConfigFiles(nameModule, nameClass, relativePath) {
        const fs = require('fs');
        const path = require('path');
        let content = fs.readdirSync(this.getConfigPath());
        let body;
        let pathFile;
        relativePath = relativePath ? relativePath : '';
        for (let cont = 0; content.length > cont; cont++) {
            if (content[cont].startsWith('module')) {
                pathFile = `${this.getConfigPath()}${path.sep}${content[cont]}`;
                body = JSON.parse(fs.readFileSync(pathFile).toString());
                for (let cont = 0; body.length > cont; cont++) {
                    if (body[cont].name === nameModule) {
                        body[cont].autoloads.push(`src${path.sep}${relativePath}${nameClass}.js`);
                    }
                }
                fs.writeFileSync(pathFile, JSON.stringify(body, null, '    '));
            }
        }
    }
}
exports.CreateClassModuleCommand = CreateClassModuleCommand;
