const inquirer = require('inquirer');
const files = require('./files');

module.exports = {

    askIfIHappy: () => {
        const questions = [
            {
                name: 'Name',
                type: 'input',
                message: 'Enter your Name:',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your Name.';
                    }
                }
            },
            {
                name: 'Felice',
                type: 'input',
                message: 'Quanto sei felice? (da 0 a 10)',
                validate: function (value) {
                    if (value > 5) {
                        return true;
                    } else {
                        return 'Potresti essere più felice';
                    }
                }
            }
        ];
        return inquirer.prompt(questions);
    },

    createModule: () => {
        //first command to create a base module
    }
}