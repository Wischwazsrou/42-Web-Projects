module.exports = {
    update_likes: function (db, req) {
        if (req.body.state == "Like") {
            db.collection("likes").insert({
                likerUser: req.body.liker_user,
                likedUser: req.body.liked_user
            });
        }
        else {
            db.collection("likes").remove({
                likerUser: req.body.liker_user,
                likedUser: req.body.liked_user
            });
        }
    }
};
