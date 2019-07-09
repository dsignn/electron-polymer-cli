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
    setProcess(process: any) {
        this.process = process;
        return this;
    }

    /**
     * @return {any}
     */
    getProcess() {
        return this.process;
    }

    /**
     * @return {Array<any>}
     */
    getArgs() {
        let args = [];
        if (this.process) {
            args = this.process.argv;
        }
        return args
    }

    /**
     * @param {number} index
     * @return {string|null}
     */
    getArgsByIndex(index) {
        let arg = null;

        if (this.process && this.process.argv && this.process.argv[index]) {
            arg = this.process.argv[index];
        }
        return arg
    }

    /**
     * @return {string}
     */
    getRootPath() {
        let path = '';
        if (this.getProcess()) {
            path = this.getProcess().cwd();
        }
        return path
    }

    /**
     * @return {string}
     */
    getApplicationPath() {
        const path = require('path');
        return `${this.getRootPath()}${path.sep}app`;
    }

    /**
     * @return {string}
     */
    getConfigPath() {
        const path = require('path');
        return `${this.getApplicationPath()}${path.sep}config`;
    }

    /**
     * @return {string}
     */
    getModulesPath() {
        const path = require('path');
        return `${this.getApplicationPath()}${path.sep}module`;
    }
}
