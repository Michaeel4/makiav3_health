const mongoose = require('mongoose');
const dummy = require('mongoose-dummy');
const ignoredFields = ['_id','created_at', '__v', /detail.*_info/];

let genderValues = ['Male', 'Female']
let schemaDefinition = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
    },
    birth_date: {
        type: Date
    },
    gender: {
        type: String,
        enum: genderValues
    },
    data: {
        type: Object,
        default: null
    },
    results: [
        {
            score: Number,
            course: Number
        }
    ],
    is_student: {
        type: Boolean
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId
    },
    detail: {
        main_info: String,
        some_info: String,
        none_match: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
let model = mongoose.model('Student', schemaDefinition);
let randomObject = dummy(model, {
    ignore: ignoredFields,
    returnDate: true
})
console.log(randomObject);