const Koa = require('koa');
const bodyParser = require('koa-body')();

const app = new Koa();
const api = require('./api');

app
    .use(bodyParser)
    .use(api.routes())
    .use(api.allowedMethods())

app.listen(process.env.PORT || 3001);
