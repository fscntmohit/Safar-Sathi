import './index.js';
const cors = require("cors");

app.use(cors({
  origin: "https://safar-sathi-56jp.vercel.app/",
  credentials: true
}));