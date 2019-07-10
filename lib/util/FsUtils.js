"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
class FsUtils {
    /**
     * @param {string} url
     */
    static rmDirRecursive(url) {
        const fs = require('fs');
        const path = require('path');
        if (fs.existsSync(url)) {
            fs.readdirSync(url).forEach((file, index) => {
                let curPath = `${url}${path.sep}${file}`;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    FsUtils.rmDirRecursive(curPath);
                }
                else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(url);
        }
    }
}
exports.FsUtils = FsUtils;
