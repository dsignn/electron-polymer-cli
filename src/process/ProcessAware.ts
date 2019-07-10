/**
 *
 */
export class ProcessAware {

    /**
     *
     */
    protected process: any;

    /**
     *
     * @param process
     * @return {ProcessAware}
     */
    public setProcess(process: any) {
        this.process = process;
        return this;
    }

    /**
     * @return {any}
     */
    public getProcess() {
        return this.process;
    }

    /**
     * @return {Array<any>}
     */
    public getArgs() {
        let args = [];
        if (this.process) {
            args = this.process.argv;
        }
        return args
    }

    /**
     * @param {number} index
     * @return {string}
     */
    public getArgsByIndex(index) {
        let arg = '';

        if (this.process && this.process.argv && this.process.argv[index]) {
            arg = this.process.argv[index];
        }
        return arg
    }

    /**
     * @return {string}
     */
    public getRootPath() {
        let path = '';
        if (this.getProcess()) {
            path = this.getProcess().cwd();
        }
        return path
    }

    /**
     * @return {string}
     */
    public getApplicationPath() {
        const path = require('path');
        return `${this.getRootPath()}${path.sep}app`;
    }

    /**
     * @return {string}
     */
    public getConfigPath() {
        const path = require('path');
        return `${this.getApplicationPath()}${path.sep}config`;
    }

    /**
     * @return {string}
     */
    public getModulesPath() {
        const path = require('path');
        return `${this.getApplicationPath()}${path.sep}module`;
    }
}
