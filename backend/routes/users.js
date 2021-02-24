const express = require("express");
const router = express.Router();
const nodeMailer = require("nodemailer");
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

//---------------------------------------------------------------------------------------------// nodemailer

//메일 발송 서비스에 대한 환경 설정
const mailPoster = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: "djm05051@gmail.com",
    pass: "dlwogk23v!",
  },
});

//메일을 받을 유저 설정
const mailOpt = (user_data, title, contents) => {
  const mailOptions = {
    from: "djm05051@gmail.com",
    to: user_data.email,
    subject: title,
    html: contents,
  };

  return mailOptions;
};

//메일 전송
const sendMail = (mailOption) => {
  mailPoster.sendMail(mailOption, (error, info) => {
    if (error) {
      console.log("에러" + error);
    } else {
      console.log("전송완료" + info.response);
    }
  });
};

//---------------------------------------------------------------------------------------------//auth

router.get("/auth", auth, (req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말.

  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true, // ex) role 0 user    role 1 admin
    isAuth: true,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    image: req.user.image,
  });
});

//---------------------------------------------------------------------------------------------//register

router.post("/register", (req, res) => {
  const user = new User(req.body);

  //회원 가입 할 때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

//---------------------------------------------------------------------------------------------//login

router.post("/login", (req, res) => {
  // 요청된 아이디를 데이터베이스에서 있는지 찾는다.

  User.findOne({ id: req.body.id }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "입력한 아이디에 해당하는 유저가 없습니다.",
      });

    //요청된 아이디가 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인.

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });

      //비밀번호 까지 맞다면 토큰을 생성하기.

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 쿠키에 토큰을 저장한다.

        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

//---------------------------------------------------------------------------------------------//logout

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    // 해당 user id를 찾아서 token과 tokenExp를 지워준다.
    { _id: req.user._id },
    { token: "", tokenExp: "" },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

//---------------------------------------------------------------------------------------------//check_id

router.post("/check_id", (req, res) => {
  User.findOne({ id: req.body.id }, (err, doc) => {
    if (doc) {
      res.json({ success: false });
    } else {
      res.json({ success: true });
    }
  });
});

//---------------------------------------------------------------------------------------------//check_email

router.post("/check_email", (req, res) => {
  let Id = req.body.id;
  let Email = req.body.email;

  User.findOne({ $and: [{ id: Id }, { email: Email }] }).exec((err, result) => {
    if (!result) {
      //전송될 메일의 제목 지정
      const title = "[SNS품앗이] 이메일 인증";

      //전송될 메일의 내용 지정
      const contents = () => {
        let number = "";
        let random = 0;

        //6자리 임의의 숫자를 구하는 코드
        for (let i = 0; i < 6; i++) {
          random = Math.trunc(Math.random() * (9 - 0) + 0);
          number += random;
        }
        secret = number;
        return `<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; min-width: 290px; max-width: 600px; margin: 0 auto" width="100%">
        <tbody><tr><td style="padding: 14px 0 50px; font-size: 0;">
            </td></tr><tr><td style="padding: 0 10px;">
                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;" width="100%">
                    <tbody><tr><td style="padding: 0 0 16px; color: #000000; line-height: 42px; font-family: 'AppleSDGothicNeo', 'Apple SD Gothic Neo','Apple SD 산돌고딕 Neo',sans-serif; font-size: 32px; font-weight: bold; border-bottom-color: #000000; border-bottom-width: 2px; border-bottom-style: solid;">이메일 인증</td></tr><tr><td style="padding-top:32px; color: #000000; line-height: 24px; font-family: 'AppleSDGothicNeo', 'Apple SD Gothic Neo','Apple SD 산돌고딕 Neo',sans-serif; font-size: 16px; font-weight: bold; word-break: keep-all;">안녕하세요! SNS 품앗이입니다.</td></tr><tr><td style="padding:40px 0 72px">
                            <table border="0" cellpadding="0" cellspacing="0" style="border: 1px solid #eeeeee; border-image: none; border-collapse: collapse;" width="100%">
                                <colgroup><col width="149"><col width="auto"></colgroup>
                                <tbody><tr><td colspan="3" style="padding: 20px; background: #eeeeee; color: #000000; line-height: 24px; font-family: 'AppleSDGothicNeo', 'Apple SD Gothic Neo','Apple SD 산돌고딕 Neo',sans-serif; font-size: 16px; font-weight: bold; text-align: center;">숫자코드</td></tr><tr><td style="padding: 20px 20px 20px 20px; color: #777777; line-height: 24px; font-family: 'AppleSDGothicNeo', 'Apple SD Gothic Neo','Apple SD 산돌고딕 Neo',sans-serif; font-size: 16px; border-bottom-color: #eeeeee; border-bottom-width: 1px; border-bottom-style: solid; word-break: keep-all; text-align: center;">${number}</td></tr></tbody>
                            </table>
                        </td></tr>
                        </tbody>
                </table>
            </td></tr></tbody>
    </table>`;
      };

      //메일 발송
      const mailOption = mailOpt(req.body, title, contents());
      sendMail(mailOption);

      res.send(secret);
    } else {
      res.send(false);
    }
  });
});

module.exports = router;
