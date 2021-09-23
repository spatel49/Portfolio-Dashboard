const express = require('express');
const router = express.Router();
const data = require('../data');
const companies = data.companies;
const traders = data.traders;
const reviews = data.reviews;
const news = data.news;
const xss = require('xss');

router.get('/', async (req, res) => {
    if(!req.session.user) {
        return res.status(403).render('users/notLoggedIn', {title: "Not Logged In", loggedIn: false});
    }
    try {
        // Gets all news
        let actionItem = "" + new Date() + ": Viewed NewsFeed.";
        const updateHistory = await traders.addTraderHistory(req.session.user._id, actionItem);
        const topNews = await news.getTopNews("");
        res.render('news/news', {
            title: "Today's Headlines",
            loggedIn: true,
            topNews: topNews
        });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/', async (req, res) => {
    try {
        //Storing History
        let actionItem = "" + new Date() + ": Viewed NewsFeed.";
        const updateHistory = await traders.addTraderHistory(req.session.user._id, actionItem);
    } catch (e) {
        res.status(404).json({ message: e });
    }
});

router.post('/');

module.exports = router;
