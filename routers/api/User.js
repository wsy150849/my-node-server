const express = require('express');
const router = express.Router();
const User = require('../../module/users');
const bcrypt = require('bcrypt');

router.get('/test', (req, res) => {
    res.json({ msg: "用户接口测试成功" });
});

router.post('/register', (req, res) => {
    // 规范化请求体：兼容常见拼写错误（例如 emali / pasword）并进行基础校验
    const name = req.body.name || req.body.nam || '';
    const email = req.body.email || req.body.emali || '';
    const password = req.body.password || req.body.pasword || '';
    // debug: 打印接收到的 key（不要在生产环境打印明文密码）
    console.log('register body keys:', Object.keys(req.body));

    if (!email) return res.status(400).json({ email: '邮箱不能为空' });
    if (!password) return res.status(400).json({ password: '密码不能为空' });

    User.findOne({ email: email })
        .then((user) => {
            if (user) {
                return res.status(400).json({ email: "邮箱已被注册！" })
            } else {
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password
                })

                // 密码加密 - 验证输入并处理 genSalt/hash 错误，避免崩溃
                if (!newUser.password) {
                    return res.status(400).json({ password: "密码不能为空" });
                }
                bcrypt.genSalt(10, function (err, salt) {
                    if (err) {
                        console.error('bcrypt.genSalt error:', err);
                        return res.status(500).json({ error: "密码加密失败" });
                    }
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            console.error('bcrypt.hash error:', err);
                            return res.status(500).json({ error: "密码加密失败" });
                        }
                        newUser.password = hash;
                        newUser.save()
                            .then(user => { res.json(user); console.log(newUser); })
                            .catch(err => {
                                console.error('save user error:', err);
                                return res.status(500).json({ error: "保存用户失败" });
                            });
                    });
                });

            }
        })
});
router.get('/getUserMsg', (req, res) => { 
    User.findOne({name:'test'}).then(user=>{res.json(user)});
})

module.exports = router;