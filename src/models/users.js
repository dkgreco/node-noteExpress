const
    mongoose = require('mongoose'),
    validator = require('validator'),
    passwordsBlacklist = require('../../config/passwords/blacklist');

const User = mongoose.model('User', {
    firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isAlpha(value)) {
                throw new Error('Name may only contain letters.');
            }
        }
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isAlpha(value)) {
                throw new Error('Name may only contain letters.');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: false,
        minlength: 7,
        validate(value) {
            passwordsBlacklist.forEach(blacklistedPassword => {
                if (value.toUpperCase().includes(blacklistedPassword)
                    || value.toLowerCase().includes(blacklistedPassword)) {
                    throw new Error('Please use a different password. The one you have chosen is not safe.');
                }
            });
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email address is invalid.');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive value.');
            }
        }
    }
});

module.exports = User;