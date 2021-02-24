const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const moment = require("moment");

//---------------------------------------------------------------------------------------------//userSchema

const userSchema = mongoose.Schema(
  {
    id: {
      type: String,
      maxlength: 15,
      trim: true,
      unique: 1,
    },
    password: {
      type: String,
      minlength: 6,
    },
    role: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      maxlength: 50,
    },
    email: {
      type: String,
      trim: true,
    },
    image: String,
    token: {
      type: String,
    },
    tokenExp: {
      type: Number,
    },
  },
  { versionKey: false }
);

//---------------------------------------------------------------------------------------------//pre

// users.js 'register' 라우트에서 mongoDB에 저장하기 전에 비밀번호를 암호화 시켜준다.

userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    //salt를 생성
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      //암호화
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash; //hash된 비밀번호로 바꾸기
        next();
      });
    });
  } else {
    next(); //빠져나가기
  }
});

//---------------------------------------------------------------------------------------------//comparePassword

// 'comparePassword'라는 이름으로 메서드를 만든다.

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // 사용자가 입력한 비밀번호 : plainPassword // DB에 있는 비밀번호 : this.password ===> 비교

  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

//---------------------------------------------------------------------------------------------//generateToken

// 'generateToken'라는 이름으로 메서드를 만든다.

userSchema.methods.generateToken = function (cb) {
  var user = this; // user._id를 쓰기 위해 사용

  console.log("user", user);
  console.log("userSchema", userSchema);

  var token = jwt.sign(user._id.toHexString(), "secret"); // jwt.sign(payload, secretKey)에서 payload는 string형식이어야 한다. ==> toHexString() 이용
  var oneHour = moment().add(1, "hour").valueOf();

  user.tokenExp = oneHour;
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

//---------------------------------------------------------------------------------------------//findByToken

userSchema.statics.findByToken = function (token, cb) {
  // method는 객체의 인스턴스를 만들어야만 사용 가능 vs statics는 객체의 인스턴스를 만들지 않아도 사용 가능

  var user = this;

  // 토큰을 decode 한다.

  jwt.verify(token, "secret", function (err, decode) {
    // decode는 user._id이다 (token - '' = user._id이니까 ''는 암호화 할 때 이용한 "secret")
    // 유저 아이디를 이용해서 유저를 찾은 다음에 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
