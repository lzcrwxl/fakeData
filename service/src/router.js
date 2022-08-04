import KoaRouter from 'koa-router';
import FakeData from './restapi/FakeData'
import konvaData from './restapi/konvaData'

const router = new KoaRouter({
  prefix: '/service'
})


const apis = [
  FakeData,
  konvaData
];

apis.forEach(api => {
    router.use( api.prefix, api.routes(), api.allowedMethods());
});

export default router;
