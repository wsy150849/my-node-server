// 引入express
const express = require('express');
// 创建应用对象
const app = express();
// 设置端口
const port = process.env.PORT || 5000;
// 监听端口，启动服务
app.listen(port, () => {
    console.log(`服务已启动，端口号：${port}`);
})

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// 引入mongoose
const mongoose = require("mongoose");
// 引入刚刚创建的数据库
const db = require("./config/key").mongoURI;
// 引入body-parser，用于执行post操作
const bodyParser = require("body-parser");

// 连接mongodb
mongoose
.connect(db,{ })
.then(()=>{console.log("mongodb 已连接")})
.catch(err => console.log(err))

//引入users
const users=require('./routers/api/User');
// 使用bodyParser中间件，对应postman中Body的x-www-form-urlencoded格式
// 这两行代码要写在app.use("/api/users",users)前面，否则无法识别到从postman输入的数据，只能得到undefined
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// 使用中间件
app.use("/api/users",users);

