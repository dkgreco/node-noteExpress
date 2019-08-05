const
    blanketErrorMsg = 'Invalid Credentials for Username/Password.  Please Try Again',
    mongoose = require('mongoose'),
    validator = require('validator'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    passwordsBlacklist = require('../../config/passwords/blacklist'),
    Tasks = require('../models/tasks'),
    userSchema = new mongoose.Schema({
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
            unique: true,
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
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true
                }
            }
        ]
    });

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

//Strip responses of sensitive data
userSchema.methods.toJSON = function() {
    const
        user = this,
        userObj = user.toObject();

    delete userObj.password;
    delete userObj.tokens;

    return userObj;
};

//JWT Auth Token
userSchema.methods.generateAuthToken = async function () {
    const
        user = this,
        jwtToken = jwt.sign({ _id: user._id.toString() }, 'Crystals123');
    console.log('Token generated: ', jwtToken);
    user.tokens = user.tokens.concat({ token: jwtToken });
    await user.save();

    return jwtToken;
}; //Instance Method

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error(blanketErrorMsg);
    }

    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error(blanketErrorMsg);
    }

    return user;
}; //Model Method

//PreSave Password Hash
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

//Remove all tasks from DB upon User Account Deletion
userSchema.pre('remove', async function(next) {
    const user = this;
    await Tasks.deleteMany({ owner: user._id });
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;