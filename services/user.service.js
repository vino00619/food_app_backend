// import files
const helper = require("../helper/user.helper");
const authhelper = require("../helper/auth.helper");

// user service
const service = {
  // All users
  async getAllUsers(req, res) {
    try {
      const data = await helper.find().toArray();
      res.send(data);
    } catch (error) {
      console.log("error-", error.message);
      res.status(500).send({ error: "cannot fetch all data" });
    }
  },

  // user by Id
  async getUsersById(req, res) {
    try {
      const data = await helper.findById(req.params.id);
      res.send(data);
    } catch (error) {
      console.log("error-", error.message);
      res.status(500).send({ error: `cannot fetch this id ${req.params.id}` });
    }
  },

  // udate user
  async updateUsers(req, res) {
    try {
      // data validation
      const newPost = await authhelper.validateSignUpSchema(req.body);
      // post validation
      const oldPost = await authhelper.findById(req.params.id);
      if (!oldPost) return res.status(400).send({ error: "id invalid" });
      // update data
      const { value } = await helper.update({ _id: oldPost._id, ...newPost });
      res.send(value);
    } catch (error) {
      console.log("error:", error.message);
      res.status(500).send({ error: error.message });
    }
  },

  // delete User ById
  async deleteUsersById(req, res) {
    try {
      // check productId
      const productId = await helper.findById(req.params.id);
      if (!productId)
        return res.status(400).send({ error: "product id invalid" });
      // delete data
      await helper.deleteById(productId._id);
      res.end();
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
};

// export
module.exports = service;
