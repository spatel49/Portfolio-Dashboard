const express = require('express');
const router = express.Router();
const data = require('../data');
const companies = data.companies;
const traders = data.traders;
const reviews = data.reviews;
const xss = require('xss');

router.get('/', async (req, res) => {
    if(!req.session.user) {
        return res.status(403).render('users/notLoggedIn', {title: "Not Logged In", loggedIn: false});
    }
    try {
        let actionItem = "" + new Date() + ": Viewed User History.";
        const updateHistory = await traders.addTraderHistory(req.session.user._id, actionItem);
        const userInfo = await traders.getTraderById(req.session.user._id);
        const allReviews = await reviews.getAllReviewsTrader(userInfo);
        let reviewsExist = (allReviews.length > 0) ? true : false;
        let avgRating = await reviews.getAverageRatingTrader(userInfo);
        avgRating = avgRating.toFixed(1);
        const allFollowing = await traders.getFollowingTraders(req.session.user._id);
        let isFollowing = (allFollowing.length > 0) ? true : false;
        res.render('users/profile', {
            title: 'Profile',
            loggedIn: true,
            userInfo: userInfo,
            allReviews: allReviews,
            avgRating: avgRating,
            allFollowing: allFollowing,
            isMainUser: true,
            reviewsExist: reviewsExist,
            isFollowing: isFollowing
        });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get('/:email', async (req, res) => {
    if(!req.session.user) {
        return res.status(403).render('users/notLoggedIn', {title: "Not Logged In", loggedIn: false});
    }
    try {
        const userInfo = await traders.getTraderByEmail(req.params.email.toLowerCase());
        const allReviews = await reviews.getAllReviewsTrader(userInfo);
        let reviewsExist = (allReviews.length > 0) ? true : false;
        const avgRating = await reviews.getAverageRatingTrader(userInfo);
        const allFollowing = await traders.getFollowingTraders(userInfo._id);
        let isMainUser = (req.session.user._id == userInfo._id) ? true : false;
        let isFollowing = (allFollowing.length > 0) ? true : false;
        let isPrivate = (userInfo.status == "private" && !isMainUser) ? true : false;
        let alreadyFollowed = await traders.alreadyFollowed(req.session.user._id, req.params.email.toLowerCase());
        res.render('users/profile', {
            title: 'Profile',
            loggedIn: true,
            userInfo: userInfo,
            allReviews: allReviews,
            avgRating: avgRating,
            allFollowing: allFollowing,
            isMainUser: isMainUser,
            reviewsExist: reviewsExist,
            isFollowing: isFollowing,
            isPrivate: isPrivate,
            alreadyFollowed: alreadyFollowed
        });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/', async (req, res) => {
    if(!req.session.user) {
        return res.status(403).render('users/notLoggedIn', {title: "Not Logged In", loggedIn: false});
    }
    try {
        if (xss(req.body.visitButton)){
            res.redirect('/profile/' + xss(req.body.visitButton));
        } else {
            res.redirect('/profile');
        }
    } catch (e) {
        res.status(404).json({ message: e });
    }
});

router.post('/:email', async (req, res) => {
    if(!req.session.user) {
        return res.status(403).render('users/notLoggedIn', {title: "Not Logged In", loggedIn: false});
    }
    try {
        if (xss(req.body.visitButton)){
            res.redirect('/profile/' + xss(req.body.visitButton));
        }  else if (xss(req.body.followButton)){
            let actionItem = "" + new Date() + ": Followed User: " + req.params.email.toLowerCase() + ".";
            const updateHistory = await traders.addTraderHistory(req.session.user._id, actionItem);
            const followUser = await traders.addFollowingArray(req.session.user._id, req.params.email.toLowerCase());
            res.redirect('/profile/' + req.params.email.toLowerCase());
        } else if (xss(req.body.unfollowButton)){
            let actionItem = "" + new Date() + ": Unfollowed User: " + req.params.email.toLowerCase() + ".";
            const updateHistory = await traders.addTraderHistory(req.session.user._id, actionItem);
            const unfollowUser = await traders.removeFollowingArray(req.session.user._id, req.params.email.toLowerCase());
            res.redirect('/profile/' + req.params.email.toLowerCase());
        } else {
            res.redirect('/profile');
        }
    } catch (e) {
        res.status(404).json({ message: e });
    }
});

module.exports = router;
