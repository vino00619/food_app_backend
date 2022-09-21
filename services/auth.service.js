// import files
const helper = require("../helper/auth.helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectId;
const nodemailer = require("nodemailer");

// auth service
const service = {
  // user register service
  async register(req, res) {
    try {
      // data validation
      const user = await helper.validateSignUpSchema(req.body);
      delete user.cPassword;
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
      const authToken = await jwt.sign(
        { _id: dbUser._id, email: dbUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "10000d" }
      );
      res.send({ message: "user login successfully", authToken });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  // user forgetPassword service
  async forgetPassword(req, res) {
    try {
      // email validation
      const user = await helper.validateEmail(req.body);
      // user existing validation
      const { email } = await helper.findByEmail(user.email);
      if (!email) return res.status(400).send({ error: "user already exist" });
      // check userId
      const { _id } = await helper.findByEmail(user.email);
      const id = ObjectId(_id).valueOf();
      // Token generation
      const authToken = await jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "10000d" }
      );
      // Nodemailer
      const sender = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });
      const composeEmail = {
        from: process.env.USER,
        to: email,
        subject: "Password Verification",
        text: `${process.env.BASE_URL}/${id}/${authToken}`,
      };
      sender.sendMail(composeEmail, function (error, info) {
        if (error) {
          console.log(error);
          res.status(400).json({ yo: "error" });
        } else {
          console.log("Message sent: " + info.response);
          res.sendStatus(200);
        }
        return res.sendStatus(200);
      });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  // user resetPassword service
  async resetPassword(req, res) {
    try {
      const { password } = await helper.validatePassword(req.body);

      // verify token
      const updatedHashPassword = await bcrypt.hash(
        password.toString(),
        await bcrypt.genSalt(10)
      );

      // check userId
      const userId = await helper.findById(req.params.id);
      const updatePassword = await helper.update({
        _id: userId._id,
        updatedHashPassword,
      });

      // send response
      res.send(updatePassword);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  async sendmail(req, res) {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    var email = req.body.email;
    var message = req.body.message;
    var subject = req.body.subject;
    var name = req.body.name;

    const mailOptions = {
      from: name,
      to: email,
      subject: subject,
      html: `${name} <noreply@${name}.com> <br /><br /> ${message}`,
    };

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        res.json({
          status: "err",
        });
        console.log(err);
      } else {
        res.json({
          status: "success",
        });
        console.log("Email Sent" + data.response);
      }
    });
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages!");
      }
    });
  },
};

// export
module.exports = service;
