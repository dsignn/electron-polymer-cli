/**
 *
 */
export interface ProcessAwareInterface {
    /**
     * @param process
     */
    setProcess(process: any);

    /**
     * @return process
     */
    getProcess();


    /**
     * @return {Array<any>}
     */
    getArgs();

    /**
     * @param {number} index
     * @return {string|null}
     */
    getArgsByIndex(index);
}
