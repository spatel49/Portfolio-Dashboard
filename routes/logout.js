const express = require('express');
const router = express.Router();
const data = require('../data');
const traders = data.traders;

router.get('/', async (req, res) => {
    if(req.session.user) {
        let actionItem = "" + new Date() + ": Successfully Logged Out.";
        const updateHistory = await traders.addTraderHistory(req.session.user._id, actionItem);
    }
    req.session.destroy();
    res.render('users/logout', {title: "Logout", loggedIn: false});
});

module.exports = router;