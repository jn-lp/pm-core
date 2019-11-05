const bcrypt = require('bcrypt-nodejs');

const saltRounds = process.env.SALT_ROUNDS || 20000;

const genSalt = (rounds) => new Promise((resolve, reject) => {
  bcrypt.genSalt(rounds, (err, result) => (err ? reject(err) : resolve(result)));
});

// eslint-disable-next-line no-async-promise-executor
const hash = (data) => new Promise(async (resolve, reject) => {
  bcrypt.hash(data, await genSalt(saltRounds), null,
    (err, result) => (err ? reject(err) : resolve(result)));
});

const compare = (data, encrypted) => new Promise((resolve, reject) => {
  bcrypt.compare(data, encrypted, (err, result) => (err ? reject(err) : resolve(result)));
});

module.exports = {
  hash,
  compare,
};
