import fs from "fs";

export const validateUser = (user) => {
  if (!user) {
    return false;
  }

  return (
    user.name && user.secondName && user.phone && user.email && "agree" in user
  );
};

export const extractNickName = (header) => {
  if (!header) {
    return;
  }

  const idx = header.indexOf("Bearer:");
  if (idx < 0) {
    return;
  }

  return header.slice(idx + "Bearer:".length).trim();
};

export const prepareData = (obj, nickName) => {
  let users = getAllData(nickName);

  users.push(obj);

  return JSON.stringify(users, null, 2);
};

export const getAllData = (nickName) => {
  let users = [];

  try {
    const oldData = fs.readFileSync(`data/${nickName}.json`, "utf8");
    users = JSON.parse(oldData);
  } catch (err) {
    console.log(`Error while reading data | ${err.message}`);
  }

  return users;
};
