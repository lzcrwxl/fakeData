import KoaRouter from 'koa-router';
// const router = KoaRouter();
// const routePrefix = '/conferenceCheckin';
const router = new KoaRouter({
  prefix: '/service'
})


import FakeData from './restapi/FakeData'
const apis = [
  FakeData,
];

apis.forEach(api => {
    router.use( api.prefix, api.routes(), api.allowedMethods());
});

export default router;
