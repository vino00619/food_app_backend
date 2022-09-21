// import files
const helper = require("../helper/orders.helper");
const authhelper = require("../helper/auth.helper");

// order service
const service = {
  // All orders
  async getAllOrders(req, res) {
    try {
      const data = await helper.find();
      res.send(data);
    } catch (error) {
      console.log("error", error.message);
      res.status(500).send({ error: "cannot fetch orders" });
    }
  },

  // All orders user by Id
  async getAllOrdersUserById(req, res) {
    try {
      const data = await helper.findByUserId(req.params.userId);
      res.send(data);
    } catch (error) {
      console.log("error", error.message);
      res.status(500).send({ error: `cannot fetch this id ${req.params.id}` });
    }
  },

  // orders by Id
  async getOrdersById(req, res) {
    try {
      const data = await helper.findById(req.params.id);
      res.send(data);
    } catch (error) {
      console.log("error", error.message);
      res.status(500).send({ error: `cannot fetch this id ${req.params.id}` });
    }
  },

  // create orders
  async createOrders(req, res) {
    try {
      // data validation
      const post = await helper.validate(req.body);
      // user validation
      const user = await authhelper.findById(post.userId);
      if (!user) return res.status(400).send({ error: "user Invalid" });
      // Insert orders
      const { insertedId: _id } = await helper.create({
        ...post,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });
      res.send({ _id, ...post });
    } catch (error) {
      console.log("error:", error.message);
      res.status(500).send({ error: "incorrect data try again" });
    }
  },

  // update orders
  async updateOrders(req, res) {
    try {
      // data validation
      const newPost = await helper.validate(req.body);
      // post validation
      const oldPost = await helper.findById(req.params.id);
      if (!oldPost) return res.status(400).send({ error: "order id invalid" });
      // user validation
      const user = await authhelper.findById(newPost.userId);
      if (!user) return res.status(400).send({ error: "user invalid" });
      // update order
      const { value } = await helper.update({ _id: oldPost._id, ...newPost });
      res.send(value);
    } catch (error) {
      console.log("error:", error.message);
      res.status(500).send({ error: error.message });
    }
  },

  // delete order by Id
  async deleteOrdersById(req, res) {
    try {
      // check productId
      const post = await helper.findById(req.params.id);
      if (!post) return res.status(400).send({ error: "product id invalid" });
      // delete data
      await helper.deleteById(post._id);
      res.end();
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
};

// export
module.exports = service;
