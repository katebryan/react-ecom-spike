require("dotenv").config();
express = require("express");
cors = require("cors");
const { oktaAuthRequired } = require("./lib/oktaAuthRequired");

const app = express();
const PORT = process.env.APP_PORT;

app.use(cors());

app.get("/api/locked", oktaAuthRequired, (_, res) => {
  res.json({
    messages: [
      {
        date: new Date(),
        text: "Welcome in, you have access!!!",
      },
    ],
  });
});

app.get("/api/unlocked", (_, res) => {
  res.json({
    messages: [
      {
        date: new Date(),
        text: "No authorisation required!",
      },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Live on http://localhost:${PORT}`);
});
