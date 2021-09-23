const mongoCollections = require('../config/mongoCollections');
const traders = mongoCollections.traders;
const stocks = mongoCollections.stocks;
const bcrypt = require('bcryptjs');
const saltRounds = 16;
const { ObjectId } = require('mongodb');
let path = require('path');
let companies = require( path.resolve( __dirname, "./companies.js" ) );
// const data = require('../data');
// const companies = data.companies;

module.exports = {
    async addNewTrader(firstName, lastName, email, gender, age, status, password) {
        if(!firstName || typeof firstName !== "string") throw 'Your first name must be provided and must be a string.';
        if(!lastName || typeof lastName !== "string") throw 'Your last name must be provided and must be a string.';
        if(!email) throw 'Email must be provided.';
        if(!gender || typeof gender !== "string") throw 'Your gender must be provided and must be a string.';
        if(!age || typeof age !== "number") throw 'Your age must be provided and must be a number.';
        if(!password) throw 'Password must be provided.';

        const hash = await bcrypt.hash(password, saltRounds);

        const tradersCollection = await traders();

        let newTrader = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            gender: gender,
            age: age,
            status: status,
            stockArray: [],
            reviewArray: [],
            historyArray: [],
            followingArray: [],
            hashPassword: hash
        };

        const insertTrader = await tradersCollection.insertOne(newTrader);
        if(insertTrader.insertedCount === 0) throw 'Could not create the new trader.';
        
        const newId = insertTrader.insertedId.toString();
        const getTrader = await this.getTraderById(newId);
 
        return getTrader;
    },

    async getAllTraders() {
        const tradersCollection = await traders();
        const tradersList = await tradersCollection.find({}).toArray();

        if(tradersList.length === 0) {
            return [];
        }

        for(let trader of tradersList) {
            const stringId = trader._id.toString();
            trader._id = stringId;
        }

        return tradersList;
    },

    async getTraderById(id) {
        if(!id || typeof id !== 'string' || id === "" || id.trim() === "") throw 'The id must be provided';
        let parsedId = ObjectId(id);

        const tradersCollection = await traders();

        const foundTrader = await tradersCollection.findOne({_id: parsedId});
        if(foundTrader === null) throw 'There are no traders with the id provided.';

        const stringId = foundTrader._id.toString();
        foundTrader._id = stringId;

        return foundTrader;
    }, 
    
    async getTraderByEmail(email) {
        if(!email || email === "" || email.trim() === "") throw 'A non-empty email must be provided';

        const tradersCollection = await traders();

        const foundTrader = await tradersCollection.findOne({email: email});
        if(foundTrader === null) throw 'There are no traders with the email provided.';

        const stringId = foundTrader._id.toString();
        foundTrader._id = stringId;

        return foundTrader;
    },

    async addTraderHistory(id, actionItem){
        if(!id) throw 'You must provide the trader id.';
        if(!actionItem) throw 'You must provide an action item for the history.';
        const tradersCollection = await traders();
        let objectId = new ObjectId(id);
        const trader1 = await tradersCollection.findOne({ _id: objectId });
        let updatedTradersData = {};
        let arr = trader1.historyArray;
        arr.push(actionItem);
        updatedTradersData.historyArray = arr;
        const updatedInfo = await tradersCollection.updateOne(
            { _id: objectId },
            { $set: updatedTradersData }
        );
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update trader history successfully';
        }
        return arr;
    },

    async removeTraderHistory(id){
        if(!id) throw 'You must provide an id for the trader.';
        const tradersCollection = await traders();
        let objectId = new ObjectId(id);
        const trader1 = await tradersCollection.findOne({ _id: objectId });
        let updatedTradersData = {};
        updatedTradersData.historyArray = [];
        const updatedInfo = await tradersCollection.updateOne(
            { _id: objectId },
            { $set: updatedTradersData }
        );
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update trader history successfully';
        }
        return "deleted";
    }, 

    async tickerExists(traderID, stockID){
        if(!traderID) throw 'You must provide the trader id.';
        if(!stockID) throw 'You must provide a stock id.';
        const tradersCollection = await traders();
        let objectId = new ObjectId(traderID);
        const trader1 = await tradersCollection.findOne({ _id: objectId });
        let exists = false;
        for(let id of trader1.stockArray) {
            if (id == stockID){
                exists = true;
            }
        }
        return exists;
    }, 

    async getSuggestions(traderID){
        if(!traderID) throw 'You must provide a trader id.';
        const tradersCollection = await traders();
        let objectId = new ObjectId(traderID);
        const trader1 = await tradersCollection.findOne({ _id: objectId });
        let arrIndustries = [];

        for(let id of trader1.stockArray) {
            let company = await companies.getCompanyById(id);
            arrIndustries.push(company.finnhubIndustry);
        }
        let uniqueIndustries = arrIndustries.reduce(function(a,b){
            if (a.indexOf(b) < 0 ) a.push(b);
            return a;
          },[]);
        const allCompanies = await companies.getAllCompanies();
        let stockSuggestions = [];
        for(let company1 of allCompanies) {
            for (let industry1 in uniqueIndustries){
                if (uniqueIndustries[industry1] == company1.finnhubIndustry && !(trader1.stockArray).includes(company1._id) ){
                    stockSuggestions.push(company1);
                }
            }
        }
        return stockSuggestions;
    },

    async getTraderCompanies(traderID){
        if(!traderID) throw 'Must provide a trader id.';
        const tradersCollection = await traders();
        let objectId = new ObjectId(traderID);
        const trader1 = await tradersCollection.findOne({ _id: objectId });

        // let arr = [];
        // for(let id of trader1.stockArray) {
        //     let company = await companies.getCompanyById(id);
        //     arr.push(company);
        // }
        // return arr;

        let sortedArray = [];
        let arrayToSort = [];

        for(let stockID of trader1.stockArray) {
            const stockInfo = await companies.getCompanyById(stockID);
            arrayToSort.push([stockID, stockInfo.name.toUpperCase()]);
        }
        sortedArray = arrayToSort.sort(function(a,b) {
                if(a[1] > b[1]) return 1;
                else if(a[1] < b[1]) return -1;
                else return 0;
        });

        let sortedTraderCompanies = [];
        for (let arr of sortedArray) {
            //convert ObjectId in sortedArray to stringID
            const stringId = arr[0].toString();
            const company = await companies.getCompanyById(stringId);
            sortedTraderCompanies.push(company);
        }
        return sortedTraderCompanies;
    },

    async removeTraderStock(traderID, ticker){
        if(!traderID) throw 'Must provide a traderID.';
        if(!ticker) throw 'Must provide a ticker.';
        const tradersCollection = await traders();
        let objectId = new ObjectId(traderID);
        const trader1 = await tradersCollection.findOne({ _id: objectId });
        let company = await companies.getCompany(ticker);
        let updatedTradersData = {};
        let arr = trader1.stockArray;
        for(let i = 0; i < arr.length; i++){          
            if (arr[i] === company._id) { 
                arr.splice(i, 1);
            }
        }
        updatedTradersData.stockArray = arr;
        const updatedInfo = await tradersCollection.updateOne(
            { _id: objectId },
            { $set: updatedTradersData }
        );
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update trader history successfully';
        }
        return arr;
    },

    async addFollowingArray(id, uniqueIndentifier){
        if(!id) throw 'Must provide an id.';
        if(!uniqueIndentifier) throw 'Must provide a unique identifier.';
        const tradersCollection = await traders();
        let objectId = new ObjectId(id);
        const trader1 = await tradersCollection.findOne({ _id: objectId });
        let updatedTradersData = {};
        let arr = trader1.followingArray;
        let isNewUser = true;
        for (let fl of arr) {
            if (fl == uniqueIndentifier) {
                isNewUser = false;
            }
        }
        if (isNewUser) {
            arr.push(uniqueIndentifier);
            updatedTradersData.followingArray = arr;
            const updatedInfo = await tradersCollection.updateOne(
                { _id: objectId },
                { $set: updatedTradersData }
            );
            if (updatedInfo.modifiedCount === 0) {
                throw 'could not update users following data successfully';
            }
        }
        return arr;
    },

    async removeFollowingArray(traderID, uniqueIndentifier){
        if(!traderID) throw 'Must provide the id of trader.';
        if(!uniqueIndentifier) throw 'Must provide a unique identifier.';
        const tradersCollection = await traders();
        let objectId = new ObjectId(traderID);
        const trader1 = await tradersCollection.findOne({ _id: objectId });
        let updatedTradersData = {};
        let arr = trader1.followingArray;
        for(let i = 0; i < arr.length; i++){          
            if (arr[i] === uniqueIndentifier) { 
                arr.splice(i, 1);
            }
        }
        updatedTradersData.followingArray = arr;
        const updatedInfo = await tradersCollection.updateOne(
            { _id: objectId },
            { $set: updatedTradersData }
        );
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update users following data successfully';
        }
        return arr;
    },

    async getMostPopularStocks(traderID){
        if(!traderID) throw 'Must provide the id of the trader.';
        const tradersCollection = await traders();
        let objectId = new ObjectId(traderID);
        const trader1 = await tradersCollection.findOne({ _id: objectId });
        let arr = trader1.followingArray;
        let allStocks = [];
        for (let fl of arr) {
            let secTrader = await this.getTraderByEmail(fl);
            allStocks = allStocks.concat(secTrader.stockArray);
        }
        let uniqueStocks = allStocks.reduce(function(a,b){
            if (a.indexOf(b) < 0 ) a.push(b);
            return a;
          },[]);
        const allCompanies = await companies.getAllCompanies();
        let popularStocks = [];
        for(let company1 of allCompanies) {
            for (let stock1 in uniqueStocks){
                if (uniqueStocks[stock1] == company1._id){
                    popularStocks.push(company1);
                }
            }
        }
        return popularStocks;
    },

    async alreadyFollowed(traderID, uniqueIndentifier){
        if(!traderID) throw 'Must provide a trader id.';
        if(!uniqueIndentifier) throw 'Must provide a unique identifier.';
        const tradersCollection = await traders();
        let objectId = new ObjectId(traderID);
        const trader1 = await tradersCollection.findOne({ _id: objectId });
        let arr = trader1.followingArray;
        let isNewUser = true;
        for (let fl of arr) {
            if (fl == uniqueIndentifier) {
                isNewUser = false;
            }
        }
        return !isNewUser;
    },

    async getFollowingTraders(id){
        if(!id) throw 'Must provide an id.';
        const tradersCollection = await traders();
        let objectId = new ObjectId(id);
        const trader1 = await tradersCollection.findOne({ _id: objectId });
        let arr = trader1.followingArray;
        let finalarr = [];
        for (let fl of arr) {
            let trader1 = await this.getTraderByEmail(fl);
            finalarr.push(trader1);
        }
        return finalarr;
    }
};