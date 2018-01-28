const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-body')();

const app = new Koa();
const router = new Router();

const users = [
    {
        name: 'Rocky',
        email: 'rocky@gmail.com'
    },
    {
        name: 'Foo',
        email: 'foo@gmail.com'

    },
    {
        name: 'Bar',
        email: 'bar@gmail.com'

    },
    {
        name: 'Hot',
        email: 'hot@gmail.com'
    }
];

router.get('/users', ctx => ctx.body = users);

app
    .use(bodyParser)
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(process.env.PORT || 3001);
