/**
 *
 */
export class FsUtils {

    /**
     * @param {string} url
     */
    public static rmDirRecursive(url: string) {
        const fs = require('fs');
        const path = require('path');

        if( fs.existsSync(url) ) {
            fs.readdirSync(url).forEach((file,index) => {
                let curPath = `${url}${path.sep}${file}`;
                if(fs.lstatSync(curPath).isDirectory()) { // recurse
                    FsUtils.rmDirRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(url);
        }
    }

}
