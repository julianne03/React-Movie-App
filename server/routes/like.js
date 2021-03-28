const express = require('express');
const router = express.Router();
const { Like } = require("../models/Like");
const { Dislike } = require('../models/Dislike');

//=================================
//             Like
//=================================

router.post("/getLikes", (req, res) => {

    let variable = {}

    if(req.body.movieId) {
        variable = { movieId: req.body.movieId, userId: req.body.userId }
    } else {
        variable = { commentId : req.body.commentId, userId: req.body.userId }
    }

    Like.find(variable)
        .exec((err, likes) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({ success: true, likes })
        })

    
});

router.post("/getDisLikes", (req, res) => {

    let variable = {}

    if(req.body.movieId) {
        variable = { movieId: req.body.movieId, userId: req.body.userId }
    } else {
        variable = { commentId : req.body.commentId, userId: req.body.userId }
    }

    Dislike.find(variable)
        .exec((err, dislikes) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({ success: true, dislikes })
        })

    
});

router.post("/upLike", (req, res) => {

    let variable = {}

    if(req.body.movieId) {
        variable = { movieId: req.body.movieId, userId: req.body.userId }
    } else {
        variable = { commentId : req.body.commentId, userId: req.body.userId }
    }

    // Like collection에다가 출력 정보를 넣어 주기
    const like = new Like(variable);

    like.save((err, likeResult) => {
        if(err) return res.json({ success : false, err })

        // 만약에 Dislike이 이미 클릭이 되어있다면, Dislike를 1 줄여준다.
        Dislike.findOneAndDelete(variable)
        .exec((err, disLikeResult) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true })
        })
    })   
});

router.post("/unLike", (req, res) => {

    let variable = {}

    if(req.body.movieId) {
        variable = { movieId: req.body.movieId, userId: req.body.userId }
    } else {
        variable = { commentId : req.body.commentId, userId: req.body.userId }
    }

    Like.findOneAndDelete(variable)
        .exec((err, result) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true })
    })   
});

router.post("/unDislike", (req, res) => {

    let variable = {}

    if(req.body.movieId) {
        variable = { movieId: req.body.movieId, userId: req.body.userId }
    } else {
        variable = { commentId : req.body.commentId, userId: req.body.userId }
    }

    Dislike.findOneAndDelete(variable)
        .exec((err, result) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true })
    })   
});

router.post("/upDisLike", (req, res) => {

    let variable = {}
    if (req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId , userId: req.body.userId }
    }

    const disLike = new Dislike(variable)
    //save the like information data in MongoDB
    disLike.save((err, dislikeResult) => {
        if (err) return res.json({ success: false, err });
        //In case Like Button is already clicked, we need to decrease the like by 1 
        Like.findOneAndDelete(variable)
            .exec((err, likeResult) => {
                if (err) return res.status(400).json({ success: false, err });
                res.status(200).json({ success: true })
        })
    })


})

module.exports = router;