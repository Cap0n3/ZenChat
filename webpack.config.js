const path = require('path');

module.exports = {
    mode: 'development',
    watch: true, // To watch for changes in main.js
    entry: './ZenChat/src/js/main.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/chat/static/chat/js/dist',
    },
};