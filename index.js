//利用RESTful模型並利用koa_router建構 增 刪 改 查
//暫時不涉及database

"use strict";

const Koa = require("koa");
const Router = require("koa-router");

const app = new Koa();

const Users = {}; //增加一個user等於JSON對象, 假裝它是database

const router = new Router();

app.use(async (ctx, next) => {
    const t = Date.now();
    await next();
    const rt = Date.now - t;
    console.log(rt); //統計所有請求處理時間並打印出來都在這個中間鍵處理完成
});

app.use(async (ctx, next) => {
    ctx.body = "Hello 123";
    await next();
    console.log(ctx.body);
    ctx.body = "Hello 456";
});
//要加入next才會繼續往下執行

router.get(  //controller預置前置中間鍵
    "/user/:name",
    async (ctx, next) => {
        ctx.body = "GET 123";
        await next(); 

        //balalbala...
    },
    (ctx) => {
    const { name } = ctx.params;
    console.log(ctx.body);
    ctx.body = `GET ${name}`;
});

router.post("/user", (ctx) => {

});

router.put(
    "/user/:name",
    (ctx, next) => {
        ctx.body = "GET 321";
        return next(); //這邊的next不直接等於下面這個函數, 而是在下方函數的基礎上多了一層包裝, 這個next的返回值永遠是promise
        //且必須要把這個值return出區交給koa框架去處理, 否則這個函數不是promise, 便會造成promise chian中斷無法繼續運行
        //此種寫法的限制為return next()下面的代碼不會被執行
        //當確定return next()後沒有代碼需要運行便可使用此寫法不加async await
    },
    (ctx) => {  //上方的next不直接等於這個函數, 且返回值不是promise
    const { name } = ctx.params;
    console.log(ctx.body);
    ctx.body = `GET ${name}`;
});

router.delete("/user/:name", mid, (ctx) => {

});

app.use(router.routes());

app.use((ctx, next) =>{
    ctx.body = "Hello 789!";
    return next();
});

//以下為一個可重複使用的函式寫法例子
//通常為一個具備通用處理的函式
//方變在任意位置調用而不會執行完便中斷, 因為有return next
function mid(ctx, next) {
    return next();
}

app.use(mid);

//inline內連式寫法
app.use((ctx) =>{
    ctx.body = "Hello 789!";
}); //後置兜底中間鍵

app.listen(3000, () => {
    console.log("Service start at: 3000");
});



// URL's path
// app.use((ctx) => {
//     if (ctx.url === "/user") {
//         if (ctx.request.method === "GET") {}    
//         if (ctx.request.method === "POST") {}
//         if (ctx.request.method === "PUT") {}
//         if (ctx.request.method === "DELETE") {}
//     }
// });