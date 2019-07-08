"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
class ProcessAware {
    /**
     *
     * @param process
     * @return {ProcessAware}
     */
    setProcess(process) {
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
        return args;
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
        return arg;
    }
}
exports.ProcessAware = ProcessAware;
