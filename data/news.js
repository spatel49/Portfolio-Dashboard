const mongoCollections = require('../config/mongoCollections');
const stocks = mongoCollections.stocks;
const traders = mongoCollections.traders;
const axios = require('axios');
const companies = require('./companies');
const { ObjectID } = require('mongodb');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('aaaaad37e47549f694b2d4f9940c4e09');

module.exports = {
    async getTopNews(tickerInput){
        let data;
        if (tickerInput.length == 0){
            data = await newsapi.v2.topHeadlines({
                q: "market",
                language: 'en'
            });
        } else {
            data = await newsapi.v2.topHeadlines({
                q: tickerInput,
                language: 'en'
            });
        }
        let listArticles = data.articles;
        return listArticles;
    }
};