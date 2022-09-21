// import files
const joi = require("joi");
const { ObjectId } = require("mongodb");
const db = require("../shared/mongodb");

// signUpSchema
const signUpSchema = joi.object({
  fullname: joi.string().required(),
  contactnumber: joi.number().required(),
  email: joi.string().email().required(),
  password: joi.string().min(3).max(20).required(),
  cPassword: joi.ref("password"),
});

// loginSchema
const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(3).max(20).required(),
});

// emailSchema
const emailSchema = joi.object({
  email: joi.string().email().required(),
});

// passwordSchema
const passwordSchema = joi.object({
  password: joi.string().required(),
});

// validationSchema & mongodb query
const helper = {
  validateSignUpSchema(user) {
    try {
      return signUpSchema.validateAsync(user);
    } catch ({ details: [{ message }] }) {
      throw new Error(message);
    }
  },
  validateLoginSchema(user) {
    try {
      return loginSchema.validateAsync(user);
    } catch ({ details: [{ message }] }) {
      throw new Error(message);
    }
  },
  validateEmail(user) {
    try {
      return emailSchema.validateAsync(user);
    } catch ({ details: [{ message }] }) {
      throw new Error(message);
    }
  },
  validatePassword(user) {
    try {
      return passwordSchema.validateAsync(user);
    } catch ({ details: [{ message }] }) {
      throw new Error(message);
    }
  },
  update({ _id, updatedHashPassword }) {
    return db.users.updateOne(
      { _id: ObjectId(_id) },
      { $set: { password: updatedHashPassword } },
      { returnDocument: "after" }
    );
  },
  findByEmail(email) {
    return db.users.findOne({ email });
  },
  findByEmailId(email) {
    return db.users.findOne({ email });
  },
  findById(_id) {
    return db.users.findOne({ _id: ObjectId(_id) });
  },
  createUser(user) {
    return db.users.insertOne(user);
  },
};

// export
module.exports = helper;
