// import files
const helper = require("../helper/adminauth.helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// admin auth service
const service = {
  // user register service
  async register(req, res) {
    try {
      // data validation
      const user = await helper.validateSignUpSchema(req.body);
      // user exist
      const userExist = await helper.findByEmailId(user.email);
      if (userExist)
        return res.status(400).send({ error: "user already exist" });
      // generate Password
      user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());
      // insert data
      const { insertId } = await helper.createUser({
        ...user,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });
      res.send({ message: "user sign-up successfully", userId: insertId });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  // user login service
  async login(req, res) {
    try {
      // data vaidation
      const user = await helper.validateLoginSchema(req.body);
      // user exist
      const dbUser = await helper.findByEmailId(user.email);
      if (!dbUser) return res.status(400).send({ error: "user dosn't exist" });
      // password vaidation
      const isSame = await bcrypt.compare(user.password, dbUser.password);
      if (!isSame) return res.status(400).send({ error: "wrong password" });
      // generate auth validation
      const adminauthToken = await jwt.sign(
        { _id: dbUser._id, email: dbUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "10000d" }
      );
      res.send({ message: "user login successfully", adminauthToken });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
};

// export
module.exports = service;
