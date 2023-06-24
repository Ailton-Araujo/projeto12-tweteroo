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
  const username = req.headers.user;
  const { tweet } = req.body;

  if (!users.find((user) => user.username === username)) {
    return res.status(401).send("UNAUTHORIZED");
  }
  if (!tweet || typeof tweet !== "string") {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }
  tweets.push({ username, tweet });
  res.status(201).send("Ok");
});

app.get("/tweets", (req, res) => {
  let page = req.query.page;
  if (page !== undefined) {
    if (Number(page) < 1 || isNaN(page)) {
      res.status(400).send("Informe uma página válida!");
    }
  } else {
    page = 1;
  }

  const end = Math.max(tweets.length - (page - 1) * 10, 0);
  const start = Math.max(end - 10, 0);

  console.log(start, end);
  res.send(
    tweets
      .slice(start, end)
      .map((element) => ({
        username: element.username,
        avatar: users.find((user) => user.username === element.username).avatar,
        tweet: element.tweet,
      }))
  );
});

app.get("/tweets/:USERNAME", (req, res) => {
  const name = req.params.USERNAME;
  const user = users.find((user) => user.username === name);
  if (!user) {
    return res.send([]);
  }
  res.send(
    tweets
      .filter((element) => element.username === user.username)
      .map((element) => ({
        username: element.username,
        avatar: user.avatar,
        tweet: element.tweet,
      }))
  );
});

const PORT = 5000;
app.listen(PORT, () => console.log("Server is running on PORT 5000"));
