const mongoose = require('mongoose');

const TableSchema = mongoose.Schema({
    created: {
        type: Date,
        default: Date.now,
        required: true
    },
    table_name: {
        type: String,
        required: true
    },
    chairs: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'active'
    },
    area_name: {
        type: String,
        default: ''
    },
    hotel_id: {
        type: String,
        default: ''
    },
    table_id: {
        type: String,
        default: ''
    }
});

const tables = module.exports = mongoose.model('tables', TableSchema);