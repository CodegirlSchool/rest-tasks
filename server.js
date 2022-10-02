import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";

import {
  validateUser,
  extractNickName,
  prepareData,
  getAllData,
} from "./helpers.js";

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.post("/user", (req, res) => {
  const user = req.body;
  const nickName = extractNickName(req.headers.authorization);

  if (!nickName) {
    return res
      .status(400)
      .send({ message: "Отсутствует заголовок авторизации" });
  }

  if (!validateUser(user)) {
    return res.status(400).send({ message: "Неправильный формат данных" });
  }

  try {
    fs.writeFileSync(
      `data/${nickName}.json`,
      prepareData(user, nickName),
      "utf8",
      () => {
        console.log(`Добавлена запись для пользователя ${nickName}`);
      }
    );
    return res.status(200).send({ message: "Запись успешно внесена" });
  } catch (err) {
    return res.status(500).send({ message: "О_О сервер, кажется, прилег" });
  }
});

app.get("/my-users", (req, res) => {
  const nickName = extractNickName(req.headers.authorization);

  if (!nickName) {
    return res
      .status(400)
      .send({ message: "Отсутствует заголовок авторизации" });
  }

  return res.send(getAllData(nickName));
});

app.get("/last-user", (req, res) => {
  const nickName = extractNickName(req.headers.authorization);

  if (!nickName) {
    return res
      .status(400)
      .send({ message: "Отсутствует заголовок авторизации" });
  }

  const all = getAllData(nickName);
  if (all.length > 0) {
    return res.send(all[all.length - 1]);
  }

  return res
    .status(400)
    .send({ message: "Пока не добавлено ни одного пользователя" });
});

app.listen(port);
