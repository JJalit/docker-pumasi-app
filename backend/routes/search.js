const express = require("express");
const router = express.Router();
const nodeMailer = require("nodemailer");
const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const { auth } = require("../middleware/auth");

//=================================
//             Search
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

//---------------------------------------------------------------------------------------------// id

router.post("/id", (req, res) => {
  let Name = req.body.name;
  let Email = req.body.email;

  User.findOne({ $and: [{ name: Name }, { email: Email }] }).exec(
    (err, result) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, result });
    }
  );
});

//---------------------------------------------------------------------------------------------// pw

router.post("/pw", (req, res) => {
  let Id = req.body.id;
  let Name = req.body.name;
  let Email = req.body.email;

  User.findOne({ $and: [{ id: Id }, { name: Name }, { email: Email }] }).exec(
    (err, result) => {
      var res_data = {};

      if (result) {
        //전송될 메일의 제목 지정
        const title = "[SNS품앗이] 비밀번호 찾기";
        //전송될 메일의 내용 지정
        const contents = () => {
          let number = "";
          let random = 0;

          //6자리 임의의 숫자를 구하는 코드
          for (let i = 0; i < 6; i++) {
            random = Math.trunc(Math.random() * (9 - 0) + 0);
            number += random;
          }

          // secret Ky의 Value 값으로 이메일로 전송된 6자리 값 추가
          res_data["secret"] = number;

          return `<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; min-width: 290px; max-width: 600px; margin: 0 auto" width="100%">
          <tbody><tr><td style="padding: 14px 0 50px; font-size: 0;">
              </td></tr><tr><td style="padding: 0 10px;">
                  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;" width="100%">
                      <tbody><tr><td style="padding: 0 0 16px; color: #000000; line-height: 42px; font-family: 'AppleSDGothicNeo', 'Apple SD Gothic Neo','Apple SD 산돌고딕 Neo',sans-serif; font-size: 32px; font-weight: bold; border-bottom-color: #000000; border-bottom-width: 2px; border-bottom-style: solid;">비밀번호 찾기</td></tr><tr><td style="padding-top:32px; color: #000000; line-height: 24px; font-family: 'AppleSDGothicNeo', 'Apple SD Gothic Neo','Apple SD 산돌고딕 Neo',sans-serif; font-size: 16px; font-weight: bold; word-break: keep-all;">안녕하세요! SNS 품앗이입니다.</td></tr><tr><td style="padding:40px 0 72px">
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

        //조회되는 데이터가 있는 경우 (메일 발송)
        const mailOption = mailOpt(result, title, contents());
        sendMail(mailOption);
        res_data["result"] = result;
        res.send(res_data);
      } else {
        res.send(false); //status(400)을 붙이니까 계속 에러뜨더라...
      }
    }
  );
});

//---------------------------------------------------------------------------------------------// pw/change

router.post("/pw/change", (req, res) => {
  let user_pw = req.body.new_pw;

  //salt를 생성
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) return res.send(err);

    //암호화
    bcrypt.hash(user_pw, salt, function (err, hash) {
      if (err) return res.send(err);
      user_pw = hash; //hash된 비밀번호로 바꾸기

      User.findOneAndUpdate(
        { id: req.body.user_id },
        { password: user_pw },
        (err, doc) => {
          if (err) return res.send(err);
          return res.status(200).json({
            success: true,
            doc,
          });
        }
      );
    });
  });
});

module.exports = router;
