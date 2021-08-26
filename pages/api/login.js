// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const bcrypt = require('bcrypt');

export default (req, res) => {
    console.log(req.query)
    console.log(process.env.PASSWORD)

    const bcryptPW = bcrypt.hashSync(req.query.password, 10)
    if(req.query.password === process.env.PASSWORD) {
        res.send({result : true , BPW : bcryptPW});
    }
    else {
        res.send({result : false});
    }
//   const token = 'logined' //token 을 만들어 넣어준다
//   res.setHeader('Set-Cookie', token) // token 을 cookie 값에 넣는다
//   res.status(200).json({ user: mockUser })
}
