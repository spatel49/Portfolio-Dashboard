const express = require('express');
const router = express.Router();
const data = require('../data');
const companies = data.companies;
const traders = data.traders;
const reviews = data.reviews;

router.get('/', async (req, res) => {
    if(!req.session.user) {
        return res.status(403).render('users/notLoggedIn', {title: "Not Logged In", loggedIn: false});
    }
    try {
        let actionItem = "" + new Date() + ": Viewed User History.";
        const updateHistory = await traders.addTraderHistory(req.session.user._id, actionItem);
        const userInfo = await traders.getTraderById(req.session.user._id);
        let historyExists = (userInfo.historyArray.length > 0) ? true : false;
        res.render('users/history', {
            title: 'User History',
            loggedIn: true,
            userInfo: userInfo,
            historyExists: historyExists
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
        const userInfo = await traders.getTraderById(req.session.user._id);
        let historyExists = (userInfo.historyArray.length > 0) ? true : false;
        if (historyExists){
            const deleted = await traders.removeTraderHistory(req.session.user._id);
            res.render('users/history', {
                title: 'User History',
                loggedIn: true,
                userInfo: [{historyArray:"No User History"}],
                historyExists: false
            });
        } else {
            res.redirect('/history');
        }
    } catch (e) {
        res.status(404).json({ message: e });
    }
});

module.exports = router;
