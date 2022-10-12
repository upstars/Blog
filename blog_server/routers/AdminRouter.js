const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { db, genid } = require("../db/DbUtils");

//登录
router.post("/login", async (req, res) => {
  let { account, password } = req.body;
  let { err, rows } = await db.async.all(
    "select * from `admin` where `account` = ? AND `password` = ?",
    [account, password]
  );

  if (err == null && rows.length > 0) {
    //生成token
    let login_token = uuidv4();
    let update_login_token = "UPDATE admin SET token=? Where id=?";
    await db.async.run(update_login_token, [login_token, rows[0].id]);
    //将admin信息返回给前端
    let admin_info = rows[0];
    admin_info.token = login_token;
    admin_info.password = "";

    res.send({
      code: 200,
      msg: "登录成功!",
      data: admin_info,
    });
  } else {
    res.send({
      code: 500,
      msg: "登录失败!",
    });
  }
});

module.exports = router;
