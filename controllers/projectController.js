const jwt = require('jsonwebtoken');
const Projects = require('../db/models/project');
const Users = require('../db/models/users');

const secret = process.env.JWT_SECRET || 'pm-secret';

module.exports = {
  create: async (ctx) => {
    const { name } = ctx.request.body;
    const { sub: ownerId } = await jwt.verify(ctx.headers.authorization, secret);
    if (!name) ctx.throw(422, 'Name required.');

    const dbProject = await Projects.create(name, ownerId);

    await Users.addProject(ownerId, dbProject.project_id);

    ctx.body = {
      name: dbProject.name,
    };
  },

  getProject: async (ctx) => {
    const dbProject = await Projects.getOne(ctx.request.body.projectId);

    ctx.body = {
      name: dbProject.name,
    };
  },
};
