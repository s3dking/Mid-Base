const { Schema, model } = require('mongoose');

let schema = new Schema({
    Content: String
});

module.exports = model('saySchema', schema);