// import files
const helper = require("../helper/products.helper");

// prodcut service
const service = {
  // All prodcuts
  async getAllProducts(req, res) {
    try {
      const data = await helper.find();
      res.send(data);
    } catch (error) {
      console.log("error", error.message);
      res.status(500).send({ error: "cannot fetch products" });
    }
  },

  // product by Id
  async getProductsById(req, res) {
    try {
      const data = await helper.findById(req.params.id);
      res.send(data);
    } catch (error) {
      console.log("error", error.message);
      res.status(500).send({ error: `cannot fetch this id ${req.params.id}` });
    }
  },

  // create product
  async createProducts(req, res) {
    try {
      // data validation
      const data = await helper.validate(req.body);
      // insert data
      const insertData = await helper.create(data);
      res.send(insertData);
    } catch (error) {
      console.log("error:", error.message);
      res.status(500).send({ error: "incorrect data try again" });
    }
  },

  // update product
  async updateProducts(req, res) {
    try {
      // data validation
      const newPost = await helper.validate(req.body);
      // post validation
      const oldPost = await helper.findById(req.params.id);
      if (!oldPost) return res.status(400).send({ error: "id invalid" });
      // update data
      const { value } = await helper.update({ _id: oldPost._id, ...newPost });
      res.send(value);
    } catch (error) {
      console.log("error:", error.message);
      res.status(500).send({ error: error.message });
    }
  },

  // delete product by Id
  async deleteProductsById(req, res) {
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
