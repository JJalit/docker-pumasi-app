const express = require("express");
const router = express.Router();
const { Image } = require("../models/Image");
var ffmpeg = require("fluent-ffmpeg");

const { auth } = require("../middleware/auth");
const multer = require("multer");
// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" || ext !== ".png" || ext !== ".jpeg" || exp !== ".mp4") {
      return cb(
        res.status(400).end("jpg, png, jpeg, mp4만 가능합니다."),
        false
      );
    }
    cb(null, true);
  },
});

const upload = multer({ storage: storage }).single("file");

//=================================
//             Article
//=================================

router.post("/uploadfiles", (req, res) => {
  // 사진을 서버에 저장한다.
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post("/uploadImage", (req, res) => {
  //이미지 정보들을 저장한다.

  const image = new Image(req.body);

  image.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

router.post("/getImages", (req, res) => {
  // 이미지 랜딩페이지에 가져오기
  let term = req.body.searchTerm;
  let refreshBtn = req.body.refreshBtn;
  let findArgs = {};
  let mediaId = req.query.id;

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      findArgs[key] = req.body.filters[key];
    }
  }

  if (term) {
    Image.find(findArgs)
      .find({ description: { $regex: term } })
      .populate("writer")
      .exec((err, tileInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true, tileInfo });
      });
  } else if (refreshBtn) {
    Image.aggregate([
      { $match: { media: mediaId } },
      { $sample: { size: 15 } },
    ]).exec((err, tileInfo) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, tileInfo });
    });
  } else if (Object.keys(findArgs).length > 0) {
    Image.find(findArgs)
      .find({ media: { $in: mediaId } })
      .populate("writer")
      .exec((err, tileInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true, tileInfo });
      });
  } else {
    Image.aggregate([
      { $match: { media: mediaId } },
      { $sample: { size: 15 } },
    ]).exec((err, tileInfo) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, tileInfo });
    });
  }
});

router.post("/articles_by_id", (req, res) => {
  let userIds = req.query.id;

  Image.find({ writer: { $in: userIds } })
    .populate("writer")
    .exec((err, articleInfo) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(articleInfo);
    });
});

router.delete("/delete", (req, res) => {
  let articleId = req.query.id;

  Image.findOneAndDelete({ _id: articleId }).exec((err, result) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, result });
  });
});

module.exports = router;
