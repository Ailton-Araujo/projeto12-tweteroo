import express, { json } from "express";
import cors from "cors";

const users = [];
const tweets = [];

const app = express();
app.use(cors());
app.use(json());

app.post("/sign-up", (req, res) => {
  const { username, avatar } = req.body;
  if (
    !username ||
    !avatar ||
    typeof username !== "string" ||
    typeof avatar !== "string"
  ) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }
  users.push({ username, avatar });
  return res.status(201).send("Ok");
});

app.post("/tweets", (req, res) => {
  const { user } = req.headers;
  const { username } = user;
  const { tweet } = req.body;
  if (!users.find((user) => user.username === username)) {
    return res.status(401).send("UNAUTHORIZED");
  }
  if (
    !username ||
    !tweet ||
    typeof username !== "string" ||
    typeof tweet !== "string"
  ) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }
  tweets.push({ username, tweet });
  return res.status(201).send("Ok");
});

const PORT = 5000;
app.listen(PORT, () => console.log("Server is running on PORT 5000"));
