const jwt = require('jsonwebtoken');
const bcrypt = require('../utils/bcrypt');
const Users = require('../db/models/users');

const secret = process.env.JWT_SECRET || 'pm-secret';
const msg = {
  wrongValue: 'Incorrect username and/or password.',
};

module.exports = {
  signup: async (ctx) => {
    const { username, password } = ctx.request.body;
    if (!username) ctx.throw(422, 'Username required.');
    if (!password) ctx.throw(422, 'Password required.');

    const dbUser = await Users.create(username, await bcrypt.hash(password));

    const payload = { sub: dbUser.id };
    const token = jwt.sign(payload, secret);
    ctx.body = {
      user: {
        username: dbUser.username,
        projects: dbUser.projects,
      },
      jwt: token,
    };
  },

  login: async (ctx) => {
    const { username, password } = ctx.request.body;
    if (!username) ctx.throw(422, 'Username required.');
    if (!password) ctx.throw(422, 'Password required.');

    const dbUser = await Users.getOne('username', username);

    if (!dbUser) ctx.throw(401, 'No such user.');
    if (await bcrypt.compare(password, dbUser.password)) {
      const payload = { sub: dbUser.id };
      const token = jwt.sign(payload, secret);
      ctx.body = {
        user: {
          username: dbUser.username,
          projects: dbUser.projects,
        },
        jwt: token,
      };
    } else {
      ctx.throw(401, msg.wrongValue);
    }
  },

  getUser: async (ctx) => {
    const { sub: id } = await jwt.verify(ctx.headers.authorization, secret);
    const dbUser = await Users.getOne('id', id);

    ctx.body = {
      username: dbUser.username,
      projects: dbUser.projects,
    };
  },

  addUserProject: async (ctx) => {
    const { sub: id } = await jwt.verify(ctx.headers.authorization, secret);
    const dbUser = await Users.addProject(id, ctx.request.body.id);

    ctx.body = {
      projects: dbUser.projects,
    };
  },

  removeUserProject: async (ctx) => {
    const { sub: id } = await jwt.verify(ctx.headers.authorization, secret);
    const dbUser = await Users.removeProject(id, ctx.request.body.id);

    ctx.body = {
      projects: dbUser.projects,
    };
  },
};
