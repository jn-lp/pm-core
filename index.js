const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const koaBody = require('koa-body')();
const { errorHandler } = require('./middleware/');

const { authController, projectController } = require('./controllers/');

const app = new Koa();
const router = new Router();

app.use(errorHandler);
app.use(cors());

// auth
router.all('/auth', (ctx) => {
  ctx.body = `list of available routes on AUTH subroute:
  * GET:/user - get User
  * POST:/signup - create new user
  * POST:/login - sign-in`;
});
router.get('/auth/user', koaBody, authController.getUser);
router.post('/auth/signup', koaBody, authController.signup);
router.post('/auth/login', koaBody, authController.login);

// project
router.all('/project', (ctx) => {
  ctx.body = `list of available routes on PROJECT subroute:
  * POST:/project - get Project
  * POST:/create - create new project`;
});
router.post('/project/project', koaBody, projectController.getProject);
router.post('/project/create', koaBody, projectController.create);

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(process.env.PORT || 5000);
