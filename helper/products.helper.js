// import files
const joi = require("joi");
const db = require("../shared/mongodb");
const ObjectId = require("mongodb").ObjectId;

// productSchema
const productSchema = joi.object({
  name: joi.string().required(),
  desc: joi.string().required(),
  img: joi.string().required(),
  price: joi.number().required(),
  rating: joi.number().required(),
  offer: joi.number().required(),
});

// validationSchema & mongodb query
const helper = {
  validate(post) {
    try {
      return productSchema.validateAsync(post);
    } catch ({ details: [{ message }] }) {
      throw new Error(message);
    }
  },

  find() {
    return db.products.find().toArray();
  },
  findById(_id) {
    return db.products.findOne({ _id: ObjectId(_id) });
  },
  create(post) {
    return db.products.insertOne(post);
  },
  update({ _id, ...post }) {
    return db.products.findOneAndUpdate(
      { _id: ObjectId(_id) },
      { $set: post },
      { returnDocument: "after" }
    );
  },
  deleteById(_id) {
    return db.products.deleteOne({ _id: ObjectId(_id) });
  },
};

// export
module.exports = helper;
