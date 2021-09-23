const mongoCollections = require('../config/mongoCollections');
const stocks = mongoCollections.stocks;
const traders = mongoCollections.traders;
const axios = require('axios');
const reviews = require('./reviews');
const { ObjectID } = require('mongodb');

const apiKey = 'bu92bcn48v6t2erin5ig';

module.exports = {
    async getAPICompany(ticker, apiKey) {
        if(!ticker || typeof ticker !== "string" || ticker === "" || ticker.trim() === "") throw 'You must provide a valid ticker.'
        if(!apiKey) throw 'You must provide a valid apiKey.';
        const { data } = await axios.get(
            `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${apiKey}`
        );
        return data;
    },
    async getAPIAllCompanies(apiKey){
        if(!apiKey) throw 'You must provide an apiKey.';
        const {data} = await axios.get(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apiKey}`);
        return data
    },
    async addCompany(tickerInput) {
        if (!tickerInput) throw 'The ticker must be provided.';
        if (
            typeof tickerInput !== 'string' ||
            tickerInput === '' ||
            tickerInput.trim() === ''
        )
            throw 'The ticker must be a string.';

        const stocksCollection = await stocks();

        const companyData = await axios.get(
            `https://finnhub.io/api/v1/stock/profile2?symbol=${tickerInput}&token=${apiKey}`
        );
        const quoteData = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${tickerInput}&token=${apiKey}`
        );
        const {
            country,
            currency,
            exchange,
            name,
            ticker,
            ipo,
            marketCapitalization,
            shareOutstanding,
            logo,
            phone,
            weburl,
            finnhubIndustry,
        } = companyData.data;
        const { o, h, l, c, pc } = quoteData.data;
        let increased = null;
        let percentIncrease = null;
        let change = parseFloat((c - pc).toFixed(2));
        if (c > pc) {
            increased = true;
            percentIncrease = parseFloat((((c - pc) / pc) * 100).toFixed(2));
        } else {
            increased = false;
            percentIncrease = parseFloat((((pc - c) / pc) * 100).toFixed(2));
        }
        let newCompany = {
            increased: increased,
            change: change,
            percentIncrease: percentIncrease,
            price: c,
            country: country,
            currency: currency,
            exchange: exchange,
            name: name,
            ticker: ticker,
            ipo: ipo,
            marketCapitalization: marketCapitalization,
            shareOutstanding: shareOutstanding,
            logo: logo,
            phone: phone,
            weburl: weburl,
            finnhubIndustry: finnhubIndustry,
            averageRating: null,
            ratingsArr: [],
            reviews: [],
            description: `${name} is a company in the ${finnhubIndustry} industry, located in ${country}, and traded on ${exchange}`
        };

        const insertCompany = await stocksCollection.insertOne(newCompany);
        if (insertCompany.insertedCount === 0)
            throw 'Could not create the company of the stocks.';

        const newId = insertCompany.insertedId.toString();
        const getStockCompany = await this.getCompany(ticker);

        return getStockCompany;
    },

    async getAllCompanies() {
        const stocksCollection = await stocks();

        const stocksList = await stocksCollection
            .find({})
            .sort({ name: 1 })
            .toArray();

        if (stocksList.length === 0) return [];

        for (let obj of stocksList) {
            const stringId = obj._id.toString();
            obj._id = stringId;
        }
        return stocksList;
    },

    async getCompany(ticker) {
        if (!ticker) throw 'The ticker must be provided.';
        if (typeof ticker !== 'string' || ticker === '' || ticker.trim() === '')
            throw 'The ticker must be a string.';

        const stocksCollection = await stocks();

        const foundCompany = await stocksCollection.findOne({ ticker: ticker });
        if (foundCompany === null)
            throw 'There are no companies found with the provided ticker.';
        const stringId = foundCompany._id.toString();
        foundCompany._id = stringId;

        return foundCompany;
    },

    async getCompanyById(id) {
        if (!id) throw 'Must provide an id';
        if (typeof id != 'string' || !id.replace(/\s/g,'').length) throw 'Type of ID must be a non-empty string';
        let objectId;
        try {
            objectId = new ObjectID(id);
        } catch (e){
            throw 'Error: Argument ID passed in must be a single String of 12 bytes or a string of 24 hex characters';
        }
        if (!objectId) throw 'Id provided is not a valid Object ID.';
        const stocksCollection = await stocks();
        const foundCompany = await stocksCollection.findOne({_id: objectId});
        if(foundCompany === null) throw 'There are no companies found with the provided id.';
        const stringId = foundCompany._id.toString();
        foundCompany._id = stringId;
        return foundCompany;
    },

    async updateCompany(ticker) {
        if(!ticker || typeof ticker !== 'string' || ticker === "" || ticker.trim() === "") throw 'You must provide a valid ticker.';
        const gotCompany = await this.getCompany(ticker);
        if (!gotCompany) throw 'Company does not exist within database.';

        let objectId = new ObjectID(gotCompany._id);
        const stocksCollection = await stocks();
        const updatedStocksData = {};
        const averageRating = await reviews.getAverageRating(gotCompany);

        // const companyData = await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${apiKey}`);
        const quoteData = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`
        );
        // const {country, currency, exchange, name, ticker1, ipo, marketCapitalization, shareOutstanding, logo, phone, weburl, finnhubIndustry} = companyData.data;
        const { o, h, l, c, pc } = quoteData.data;

        let temprating = Math.round(averageRating);
        let ratingsArr = [];
        while (temprating > 0) {
            ratingsArr.push('1');
            temprating--;
        }
        let increased = null;
        let percentIncrease = null;
        let change = parseFloat((c - pc).toFixed(2));
        if (c > pc) {
            increased = true;
            percentIncrease = parseFloat((((c - pc) / pc) * 100).toFixed(2));
        } else {
            increased = false;
            percentIncrease = parseFloat((((pc - c) / pc) * 100).toFixed(2));
        }
        updatedStocksData.increased = increased;
        updatedStocksData.change = change;
        updatedStocksData.percentIncrease = percentIncrease;
        updatedStocksData.price = c;
        updatedStocksData.country = gotCompany.country;
        updatedStocksData.currency = gotCompany.currency;
        updatedStocksData.exchange = gotCompany.exchange;
        updatedStocksData.name = gotCompany.name;
        updatedStocksData.ticker = gotCompany.ticker;
        updatedStocksData.ipo = gotCompany.ipo;
        updatedStocksData.marketCapitalization =
            gotCompany.marketCapitalization;
        updatedStocksData.shareOutstanding = gotCompany.shareOutstanding;
        updatedStocksData.logo = gotCompany.logo;
        updatedStocksData.phone = gotCompany.phone;
        updatedStocksData.weburl = gotCompany.weburl;
        updatedStocksData.finnhubIndustry = gotCompany.finnhubIndustry;
        updatedStocksData.averageRating = averageRating;
        updatedStocksData.ratingsArr = ratingsArr;
        updatedStocksData.reviews = gotCompany.reviews;
        updatedStocksData.description = gotCompany.description;

        const updatedInfo = await stocksCollection.updateOne(
            { _id: objectId },
            { $set: updatedStocksData }
        );
        return await this.getCompany(ticker);
    },

    async addStockDashboard(traderID, companyID) {
        if(!traderID) throw 'You must provide a traderID.';
        if(!companyID) throw 'You must provide a companyID.';

        const tradersCollection = await traders();
        let objectId = new ObjectID(traderID);
        const trader1 = await tradersCollection.findOne({ _id: objectId });
        if(trader1 === null) throw 'There are no traders found with the provided id.';
        let updatedTraderData = {};
        let arr = trader1.stockArray;
        let isNewStock = true;
        for (let st of arr) {
            if (st == companyID) {
                isNewStock = false;
            }
        }
        if (isNewStock) {
            arr.push(companyID);
            updatedTraderData.stockArray = arr;

            const updatedInfo = await tradersCollection.updateOne(
                { _id: objectId },
                { $set: updatedTraderData }
            );

            if (updatedInfo.modifiedCount === 0) {
                throw 'could not update company reviews successfully';
            }
        }

        return arr;
    },
};
