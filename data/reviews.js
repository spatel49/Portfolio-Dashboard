const { ObjectID } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;
const stocks = mongoCollections.stocks;
const traders = mongoCollections.traders;
let path = require('path');
let companies = require( path.resolve( __dirname, "./companies.js" ) );


module.exports = {
    async getReviewById(id){
        if (!id) throw 'Must provide an id';
        if (typeof id != 'string' || !id.replace(/\s/g,'').length) throw 'Type of ID must be a non-empty string';
        let objectId;
        try {
            objectId = new ObjectID(id);
        } catch (e){
            throw 'Error: Argument ID passed in must be a single String of 12 bytes or a string of 24 hex characters';
        }
        if (!objectId) throw 'Id provided is not a valid Object ID.';
        const reviewsCollection = await reviews();
        const review = await reviewsCollection.findOne({ _id: objectId });
        if (!review) throw 'No review found for specified id.'
        review._id = `${review._id}`;
        return review;
    },
    async addReview(reviewpost, rating, companyID, traderID) {
        if(!reviewpost) throw 'You must provide a review post.';
        if(!rating) throw 'You must provide a rating';
        if(!companyID) throw 'You must provide a companyID';
        if(!traderID) throw 'You must provide a traderID';
        let date = new Date();
        let temprating = rating;
        let ratingsArr = [];
        while (temprating > 0){
            ratingsArr.push("1");
            temprating--;
        }
        const tradersCollection = await traders();
        let objectId2 = new ObjectID(traderID);
        const trader1 = await tradersCollection.findOne({ _id: objectId2 });

        let newReview = {
            companyID: companyID,
            traderID: traderID,
            traderName: trader1.firstName + " " + trader1.lastName,
            traderEmail: trader1.email,
            date: date,
            ratingsArr: ratingsArr,
            rating: Number(rating),
            review: reviewpost
        }
        const reviewCollection = await reviews();
        const insertInfo = await reviewCollection.insertOne(newReview);
        if (insertInfo.insertedCount === 0) throw 'Could not add Review';
        const newId = insertInfo.insertedId.toString();
        const review = await this.getReviewById(newId);

        //Add review id to company collection
        const companiesCollection = await stocks();
        let objectId = new ObjectID(review.companyID);
        const company1 = await companiesCollection.findOne({ _id: objectId });
        let updatedCompanyData = {};
        let arr = company1.reviews;
        arr.push(newId);
        updatedCompanyData.reviews = arr;
        let averageRating = await this.getAverageRating(company1);

        let temprating2 = Math.round(averageRating);
        let ratingsArr2 = [];
        while (temprating2 > 0) {
            ratingsArr2.push('1');
            temprating2--;
        }
        updatedCompanyData.averageRating = averageRating;
        updatedCompanyData.ratingsArr = ratingsArr2;

        const updatedInfo = await companiesCollection.updateOne(
            { _id: objectId },
            { $set: updatedCompanyData }
        );
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update company reviews successfully';
        }

        //Add review id to trader collection
        let updatedTraderData = {};
        let arr2 = trader1.reviewArray;
        arr2.push(newId);
        updatedTraderData.reviewArray = arr2;
        const updatedInfo2 = await tradersCollection.updateOne(
            { _id: objectId2 },
            { $set: updatedTraderData }
        );
        if (updatedInfo2.modifiedCount === 0) {
            throw 'could not update company reviews successfully';
        }
        return review;
    },

    async getAllReviews(company){
        if(!company) throw 'You must provide a company to get all reviews of a company.';
        let output = [];
        let allReviews = company.reviews;
        for (let r in allReviews){
            const rev = await this.getReviewById(allReviews[r]);
            output.push( rev );
        }
        if (output.length == 0){
            // return [{review: "Reviews will appear here. Be the first to enter a review for this stock!"}];
            return -1;
        };
        return output;
    },
    
    async getAverageRating(company){
        if(!company) throw 'You must provide a company to get the average rating of a company.';
        const allReviews = await this.getAllReviews(company);
        if(allReviews === -1) {
            return null;
        }
        let avgRating = 0;
        for (let r in allReviews){
            avgRating += allReviews[r].rating;
        }
        return avgRating/allReviews.length;
    },

    async getAllReviewsTrader(trader){
        if(!trader) throw 'You must provide a trader.';
        let output = [];
        let allReviews = trader.reviewArray;
        for (let r in allReviews){
            const rev = await this.getReviewById(allReviews[r]);
            const stocksCollection = await stocks();
            let objectId2 = new ObjectID(rev.companyID);
            const company1 = await stocksCollection.findOne({ _id: objectId2 });
            rev.companyName = company1.name;
            output.push( rev );
        }
        return output;
    },

    async getAverageRatingTrader(trader){
        if(!trader) throw 'You must provide a trader.';
        const allReviews = await this.getAllReviewsTrader(trader);
        let avgRating = 0;
        for (let r in allReviews){
            avgRating += allReviews[r].rating;
        }
        return avgRating/allReviews.length;
    }
};