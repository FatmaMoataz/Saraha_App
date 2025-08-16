import mongoose from "mongoose";

export let genderEnum = {male:"male", female:"female"}
export let roleEnum = {user:"user", admin:"admin"}
export let providerEnum = {system:"system", google:"google"}

const userSchema = new mongoose.Schema({

firstName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: [20, "First Name max length is 20 char & you have entered {VALUE}"]
},
lastName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: [20, "Last Name max length is 20 char & you have entered {VALUE}"]
},
email: {
    type: String,
    required: true,
    unique: true
},
password: {
    type: String,
    required: function() {
        return this.provider === providerEnum.system ? true : false
    }
},
oldPassword:[String],
forgotPasswordOtp:String,
changeCredentialsTime:Date,
phone: {
    type: String,
    required: function() {
        return this.provider === providerEnum.system ? true : false
    }
},
gender: {
    type: String,
    enum: {values:Object.values(genderEnum), message:`gender only allowed ${Object.values(genderEnum)}`},
    default: genderEnum.male
},
role: {
    type:String,
    enum:Object.values(roleEnum),
    default:roleEnum.user
},
provider:{type:String, enum:Object.values(providerEnum), default:providerEnum.system},
confirmEmail: Date,
confirmEmailOtp:String,
picture:{secure_url:String, public_id:String},
coverImages:[{secure_url:String, public_id:String}],

deletedAt:Date,
deletedBy:{type:mongoose.Schema.Types.ObjectId, ref:"user"},

restoredAt:Date,
restoredBy:{type:mongoose.Schema.Types.ObjectId, ref:"user"}

}, {
    timestamps: true,
    toObject: {virtuals: true},
    toJSON: {virtuals: true},
})
userSchema.virtual("fullName").set(function (value) {
    const [firstName, lastName] = value?.split(" ") || []
    this.set({firstName, lastName})
}).get(function () {
    return this.firstName + " " + this.lastName
})
userSchema.virtual('messages', {
    localField:'_id',
    foreignField:'receiverId',
    ref:'Message'
})
export const UserModel = mongoose.models.User || mongoose.model("User", userSchema)
UserModel.syncIndexes()