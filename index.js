const router = require("./routes/index.js");
const express = require("express");
const errorHandler = require("./middlewares/error_middleware.js");


const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use("/api", router);
app.use(errorHandler);

const PORT = 5000;

app.listen(PORT, () => console.log(`server opens in port ${PORT}`));
