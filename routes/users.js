const express = require('express');
const { stocks } = require('../config/mongoCollections');
const router = express.Router();
const data = require('../data');
const companies = data.companies;
const apiKey = "bu92bcn48v6t2erin5ig";
const traders = data.traders;
const xss = require('xss');

router.get('/dashboard', async (req, res) => {
    if(!req.session.user) {
        return res.status(403).render('users/notLoggedIn', {title: "Not Logged In", loggedIn: false});
    }
    let actionItem = "" + new Date() + ": Viewed Dashboard.";
    const updateHistory = await traders.addTraderHistory(req.session.user._id, actionItem);
    const traderCompanies = await traders.getTraderCompanies(req.session.user._id);
    //console.log(traderCompanies)
    res.render('users/dashboard', { 
        title: 'Your Dashboard', 
        loggedIn: true,
        traderCompanies: traderCompanies
    });
});

router.get('/dashboard/:email', async (req, res) => {
    if(!req.session.user) {
        return res.status(403).render('users/notLoggedIn', {title: "Not Logged In", loggedIn: false});
    }
    try{
        const emailcheck = await traders.getTraderByEmail(req.params.email);
    } catch (e) {
        return res.sendStatus(404);
    }
    const trader1 = await traders.getTraderById(req.session.user._id);
    const trader2Info = await traders.getTraderByEmail(req.params.email);
    const traderCompanies = await traders.getTraderCompanies(trader2Info._id);
    if (trader1.email == req.params.email || trader2Info.status == "private"){
        res.redirect('/users/dashboard');
    } else {
        let actionItem = "" + new Date() + ": Viewed " + req.params.email + "'s Dashboard.";
        const updateHistory = await traders.addTraderHistory(req.session.user._id, actionItem);
        let title = trader2Info.firstName + " " + trader2Info.lastName + "'s Dashboard";
        let alreadyFollowed = await traders.alreadyFollowed(req.session.user._id, req.params.email);
        res.render('users/publicDash', { 
            title: title, 
            loggedIn: true,
            traderEmail: req.params.email,
            alreadyFollowed: alreadyFollowed,
            traderCompanies: traderCompanies
        });
    }
});

router.post('/dashboard/:email', async (req, res) => {
    if(!req.session.user) {
        return res.status(403).render('users/notLoggedIn', {title: "Not Logged In", loggedIn: false});
    }
    try{
        if (xss(req.body.addButton)){
            let stockTicker = xss(req.body.addButton);
            const company = await companies.getCompany(stockTicker);
            let actionItem = "" + new Date() + ": Added company " + company.name + " to Dashboard.";
            const updateHistory = await traders.addTraderHistory(req.session.user._id, actionItem);
            const addToDashBoard = await companies.addStockDashboard(req.session.user._id, company._id);
            res.redirect('/users/dashboard/' + req.params.email);
        } else if (xss(req.body.followButton)){
            let actionItem = "" + new Date() + ": Followed User: " + req.params.email + ".";
            const updateHistory = await traders.addTraderHistory(req.session.user._id, actionItem);
            const followUser = await traders.addFollowingArray(req.session.user._id, req.params.email);
            res.redirect('/users/dashboard/' + req.params.email);
        } else if (xss(req.body.unfollowButton)){
            let actionItem = "" + new Date() + ": Unfollowed User: " + req.params.email + ".";
            const updateHistory = await traders.addTraderHistory(req.session.user._id, actionItem);
            const unfollowUser = await traders.removeFollowingArray(req.session.user._id, req.params.email);
            res.redirect('/users/dashboard/' + req.params.email);
        }
    }catch (e){
        res.status(404).render("../views/users/error",{title: "Error Found", searchTerm: "Stock", loggedIn: true})
    }
});

//add to companies in the database

router.post('/dashboard', async (req, res) => {
    if(!req.session.user) {
        return res.status(403).render('users/notLoggedIn', {title: "Not Logged In", loggedIn: false});
    }
    try{
        if (xss(req.body.searchTicker)){
            const search = (xss(req.body.searchTicker)).toUpperCase();
            if (!xss(req.body.searchTicker) || xss(req.body.searchTicker).trim() === "") {
                res.status(404).render("../views/users/error",{title: "Error Found", searchTerm: search, loggedIn: true})
                return;
            }
            
            const company = await companies.getAPICompany(search,apiKey)
            //Checking if search term is a valid ticker or not
            if(Object.keys(company).length === 0 && company.constructor === Object){
                res.status(404).render("../views/users/error",{title: "Error Found", searchTerm: search, loggedIn: true})
                return;
            } else {
                try {
                    let companyExists = await companies.getCompany(company.ticker);
                    res.redirect(`/companies/${search}`);
                } catch (e){
                    let company2 = await companies.addCompany(search);
                    res.redirect(`/companies/${search}`);
                }
            }
        } else if (xss(req.body.showSug)) {
            const allSuggestions = await traders.getSuggestions(req.session.user._id);
            let noSuggestions = false;
            if(allSuggestions.length === 0) {
                noSuggestions = true;
            }
            const traderCompanies = await traders.getTraderCompanies(req.session.user._id);
            res.render('users/dashboard', {
                title: 'Your Dashboard',
                loggedIn: true,
                allCompanies: allSuggestions,
                sugRequest: true,
                noSuggestions: noSuggestions,
                traderCompanies: traderCompanies
            });
        } else if (xss(req.body.addButton)) {
            let stockTicker = xss(req.body.addButton);
            const company = await companies.getCompany(stockTicker);
            let actionItem = "" + new Date() + ": Added company " + company.name + " to Dashboard.";
            const updateHistory = await traders.addTraderHistory(req.session.user._id, actionItem);
            const addToDashBoard = await companies.addStockDashboard(req.session.user._id, company._id);
            res.redirect('/users/dashboard');
        } else if (xss(req.body.removeButton)) {
            let stockTicker = xss(req.body.removeButton);
            const company = await companies.getCompany(stockTicker);
            let actionItem = "" + new Date() + ": Removed company " + company.name + " from Dashboard.";
            const updateHistory = await traders.addTraderHistory(req.session.user._id, actionItem);
            const removeFromDashboard = await traders.removeTraderStock(req.session.user._id, stockTicker);
            res.redirect('/users/dashboard');
        } else if (xss(req.body.sortDashboard)) {
            let sort = xss(req.body.sortDashboard);
            const trader = await traders.getTraderById(req.session.user._id);
            const stockArray = trader.stockArray;
            let sortedArray = [];
            let arrayToSort = [];

            switch (sort) {
                case 'name':
                    for(let stockID of stockArray) {
                        const stockInfo = await companies.getCompanyById(stockID);
                        arrayToSort.push([stockID, stockInfo.name.toUpperCase()]);
                    }
                    sortedArray = arrayToSort.sort(function(a,b) {
                         if(a[1] > b[1]) return 1;
                         else if(a[1] < b[1]) return -1;
                         else return 0;
                    });
                    break;
                case 'price':
                    for(let stockID of stockArray) {
                        const stockInfo = await companies.getCompanyById(stockID);
                        arrayToSort.push([stockID, stockInfo.price]);
                    }
                    sortedArray = arrayToSort.sort(function(a,b) { return a[1] - b[1] });
                    break;
                case 'rating':
                    for(let stockID of stockArray) {
                        const stockInfo = await companies.getCompanyById(stockID);
                        arrayToSort.push([stockID, stockInfo.averageRating]);
                    }
                    sortedArray = arrayToSort.sort(function(a,b) { return b[1] - a[1] });
                    break;
            }

            //Create final sorted array to push to handlebars
            let sortedTraderCompanies = [];
            for (let arr of sortedArray) {
                //convert ObjectId in sortedArray to stringID
                const stringId = arr[0].toString();
                const company = await companies.getCompanyById(stringId);
                sortedTraderCompanies.push(company);
            }
            return res.render('users/dashboard', {
                title: 'Your Dashboard',
                loggedIn: true,
                traderCompanies: sortedTraderCompanies,
            });
        } else if (xss(req.body.searchTicker) === "" || xss(req.body.searchTicker).trim() === ""){
            return res.status(404).render("../views/users/error",{title: "Error Found", searchTerm: xss(req.body.searchTicker), loggedIn: true});
        } else {
            res.redirect('/users/dashboard');
        }
    
    }catch (e){
        res.status(404).render("../views/users/error",{title: "Error Found", searchTerm: "search", loggedIn: true})
    }
});
module.exports = router;
