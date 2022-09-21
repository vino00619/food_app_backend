// import files
require("dotenv").config();
const express = require("express");
const mongo = require("./shared/mongodb");
const middleware = require("./shared/middleware");
const routes = require("./routes/index");
const cors = require("cors");
const stripeRoute = require("./routes/stripe.service");

// port
const PORT = process.env.PORT || 5874;

// express
const app = express();

// connectivity
(async () => {
  try {
    // mongo db
    await mongo.connect();

    // middleware
    app.use(cors());
    app.use(express.json({ limit: "50mb" }));
    app.use(middleware.logging);
    app.use(middleware.maintenance);
    console.log("middleware initillized successfully");

    // routes
    app.get("/", (req, res) => res.send("hello world"));
    app.use("/auth", routes.authRoute);
    app.use("/users", routes.userRoutes);
    app.use("/products", routes.productsRoute);
    app.use("/checkout", stripeRoute);
    app.use("/orders", routes.ordersRoute);
    app.use("/admin-auth", routes.adminauthRouter);
    app.use(middleware.auth);
    console.log("routes initillized successfully");

    // port listen
    app.listen(process.env.PORT, () =>
      console.log(`server listening at a ${process.env.PORT}`)
    );
  } catch (error) {
    console.log("error starting application", error.message);
  }
})();
