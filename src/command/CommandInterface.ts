/**
 *
 */
export interface CommandInterface {

    /**
     * @type string
     */
    name: string;
    /**
     * @type string
     */
    option: string;
    /**
     * @type string
     */
    description: string;

    action();
}
