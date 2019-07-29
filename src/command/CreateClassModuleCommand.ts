import { CommandInterface } from "./CommandInterface";
import { AbstractCommand } from "./AbstractCommand";

export class CreateClassModuleCommand extends AbstractCommand implements CommandInterface{

    public description: string = 'Create class into the module';

    public name: string = 'create-class --moduleName <moduleName> --className <className>';

    public alias: string = 'crc';

    public option: string = '';

    // TODO add optional sub path
    /**
     * @param {string} nameModule
     * @param {string} nameClass
     */
    public action(nameModule: string, nameClass: string){

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
    public templateClass(nameClass: string) {
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
    protected integratePackageJson(nameModule: string, nameClass: string, relativePath?: string) {

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
    private _updateConfigFiles(nameModule: string, nameClass: string, relativePath?: string) {

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
                fs.writeFileSync(pathFile, JSON.stringify(body, null, '    ') );
            }
        }
    }
}

