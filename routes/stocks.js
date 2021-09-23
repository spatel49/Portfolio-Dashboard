const express = require('express');
const router = express.Router();
const data = require('../data');
const companies = data.companies;
const traders = data.traders;
const mongoCollections = require('../config/mongoCollections');
const stocks = mongoCollections.stocks;
const xss = require('xss');

router.get('/stocksList', async (req, res) => {
    if (!req.session.user) {
        return res.status(403).render('users/notLoggedIn', {
            title: 'Not Logged In',
            loggedIn: false,
        });
    }
    try {
        let actionItem = '' + new Date() + ': Viewed the Stocks List.';
        const updateHistory = await traders.addTraderHistory(
            req.session.user._id,
            actionItem
        );
        const allCompanies = await companies.getAllCompanies();
        const traderCompanies = await traders.getTraderCompanies(req.session.user._id);

        // Updating prices of stocks when loading stocks list page (issue: eventually gets an error, i believe it's b/c of api calls)
        // for(let company of allCompanies) {
        //     await companies.updateCompany(company.ticker);
        // }

        // const allCompaniesUpdated = await companies.getAllCompanies();

        res.render('stocks/stocksList', {
            title: 'List of Stocks',
            loggedIn: true,
            allCompanies: allCompanies,
            traderCompanies: traderCompanies
            // allCompanies: allCompaniesUpdated
        });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/stocksList', async (req, res) => {
    if (!req.session.user) {
        return res.status(403).render('users/notLoggedIn', {
            title: 'Not Logged In',
            loggedIn: false,
        });
    }
    try {
        let actionItem = '' + new Date() + ': Viewed the Stocks List.';
        const updateHistory = await traders.addTraderHistory(
            req.session.user._id,
            actionItem
        );
        if (xss(req.body.addButton)){
            let stockTicker = xss(req.body.addButton);
            const company = await companies.getCompany(stockTicker);
            let actionItem = "" + new Date() + ": Added company " + company.name + " to Dashboard.";
            const updateHistory = await traders.addTraderHistory(req.session.user._id, actionItem);
            const addToDashBoard = await companies.addStockDashboard(req.session.user._id, company._id);
            res.redirect('/stocks/stocksList');
        } else {
            let sort = xss(req.body.sort);
            const stocksCollection = await stocks();
            let stocksList;
            switch (sort) {
                case 'name':
                    stocksList = await stocksCollection
                        .find({})
                        .sort({ name: 1 })
                        .toArray();
                    break;
                case 'price':
                    stocksList = await stocksCollection
                        .find({})
                        .sort({ price: 1 })
                        .toArray();
                    break;
                case 'rating':
                    stocksList = await stocksCollection
                        .find({})
                        .sort({ averageRating: -1 })
                        .toArray();
                    break;
            }

            for (let obj of stocksList) {
                const stringId = obj._id.toString();
                obj._id = stringId;
            }
            res.render('stocks/stocksList', {
                title: 'List of Stocks',
                loggedIn: true,
                allCompanies: stocksList,
            });
        }
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;
