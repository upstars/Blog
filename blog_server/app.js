const express = require("express");
//上传
const multer = require("multer");
//数据库操作和自动生成id
const { db, genid } = require("./db/DbUtils");
const path = require("path");
const app = express();
const port = 8888;

//跨域请求
app.use(function (req, res, next) {
  //设置允许跨域的域名
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "*");
  //跨域请求的方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");

  if (req.method == "OPTIONS") {
    res.sendStatus(200);
  } else next();
});

app.use(express.json());
const update = multer({
  dest: "./public/upload/temp",
});
app.use(update.any());
//指定静态资源路径
app.use(express.static(path.join(__dirname, "public")));

//登录中间件验证
const ADMIN_TOKEN_PATH = "/_token";
app.all("*", async (req, res, next) => {
  if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
    //token验证
    let { token } = req.headers;
    let admin_token_sql = "SELECT * FROM admin WHERE token=?";
    let adminResult = await db.async.all(admin_token_sql, [token]);
    if (adminResult.err != null || adminResult.rows.length == 0) {
      res.send({
        code: 403,
        msg: "请先登录",
      });
      return;
    } else {
      next();
    }
  } else {
    next();
  }
});

//路由
//注册登录接口
app.use("/admin", require("./routers/AdminRouter"));
//注册增删改查接口
app.use("/category", require("./routers/CategoryRouter"));
//注册博客增删改查接口
app.use("/blog", require("./routers/BlogRouter"));
//注册上传接口
app.use("/upload", require("./routers/UploadRouter"));

app.get("/", (req, res) => {
  res.send("Hello");
});

//监听端口号
app.listen(port, () => {
  console.log(`启动成功http://localhost:${port}`);
});
