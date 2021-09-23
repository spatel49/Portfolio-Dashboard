const dbConnection = require("../config/mongoConnection");
const data = require("../data");
const { addFollowingArray } = require("../data/traders");
const companies = data.companies;
const traders = data.traders;
const reviews = data.reviews;

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    let company1 = await companies.addCompany("AAPL");
    let company2 = await companies.addCompany("FB");
    let company3 = await companies.addCompany("TSLA");
    let company4 = await companies.addCompany("PTON");
    let company5 = await companies.addCompany("KIRK");
    let company6 = await companies.addCompany("AMZN");
    let company7 = await companies.addCompany("MSFT");
    let company8 = await companies.addCompany("NKE");
    let company9 = await companies.addCompany("PYPL");
    let company10 = await companies.addCompany("KO");
    let company11 = await companies.addCompany("UBER");
    let company12 = await companies.addCompany("JNJ");
    let company13 = await companies.addCompany("WMT");
    let company14 = await companies.addCompany("JPM");
    let company15 = await companies.addCompany("SNAP");
    let company16 = await companies.addCompany("GE");
    let company17 = await companies.addCompany("SIRI");
    let company18 = await companies.addCompany("NFLX");
    let company19 = await companies.addCompany("LYFT");
    let company20 = await companies.addCompany("NVDA");
    let company21 = await companies.addCompany("PFE");
    let company22 = await companies.addCompany("SBUX");
    let company23 = await companies.addCompany("INTC");
    let company24 = await companies.addCompany("TWTR");
    let company25 = await companies.addCompany("F");

    let trader1 = await traders.addNewTrader('Alex', 'Smith', 'asmith@stevens.edu', 'M', 25, 'public', 'abcd');
    let trader2 = await traders.addNewTrader('Jim', 'Lake', 'jlake@stevens.edu', 'M', 28, 'public', 'abcd');
    let trader3 = await traders.addNewTrader('Bob', 'Hardway', 'bhardway@stevens.edu', 'M', 32, 'public', 'abcd');
    let trader4 = await traders.addNewTrader('Kevin', 'Lee', 'klee@stevens.edu', 'M', 18, 'private', 'abcd');
    let trader5 = await traders.addNewTrader('Mike', 'Scott', 'mscott@stevens.edu', 'M', 33, 'private', 'abcd');
    let trader6 = await traders.addNewTrader('Key', 'Lim', 'klim@stevens.edu', 'M', 42, 'private', 'abcd');
    let trader7 = await traders.addNewTrader('Raj', 'Patel', 'rpatel@stevens.edu', 'M', 32, 'private', 'abcd');
    let trader8 = await traders.addNewTrader('John', 'Slang', 'jslang@stevens.edu', 'M', 27, 'public', 'abcd');

    let review1 = await reviews.addReview("I like this company a lot!!", '5', company1._id, trader1._id);
    let review2 = await reviews.addReview("I think it could be better. Future not looking good.", '2', company2._id, trader1._id);
    let review3 = await reviews.addReview("Could be better!", '1', company3._id, trader2._id);
    let review4 = await reviews.addReview("I am bullish for this company", '5', company4._id, trader2._id);
    let review5 = await reviews.addReview("Management is great so buy this stock!!", '5', company5._id, trader3._id);
    let review6 = await reviews.addReview("I believe you will make a profit buying now", '5', company6._id, trader3._id);
    let review7 = await reviews.addReview("Poor management. Future is doomed!", '1', company7._id, trader4._id);
    let review8 = await reviews.addReview("Worst stock I ever bought. Lost thousands.", '1', company8._id, trader4._id);
    let review9 = await reviews.addReview("Nope don't even look at this stock", '1', company1._id, trader5._id);
    let review10 = await reviews.addReview("The other reviews don't know what they are talking about. OK stock.", '3', company2._id, trader5._id);
    let review11 = await reviews.addReview("I would give it a rating of: HOLD", '3', company3._id, trader6._id);
    let review12 = await reviews.addReview("I don't think this stock should have ever IPOed", '3', company4._id, trader6._id);
    let review13 = await reviews.addReview("Guaranteed 10% profit annually. Buy now.", '5', company5._id, trader7._id);
    let review14 = await reviews.addReview("Like the other review said, BUY NOW.", '5', company6._id, trader7._id);
    let review15 = await reviews.addReview("Future is looking bright for the company. Insane growth!", '5', company7._id, trader8._id);
    let review16 = await reviews.addReview("I am never selling this stock!", '5', company8._id, trader8._id);

    let trader1stocks1 = await companies.addStockDashboard(trader1._id, company1._id);
    let trader1stocks2 = await companies.addStockDashboard(trader1._id, company2._id);
    let trader1stocks3 = await companies.addStockDashboard(trader1._id, company5._id);
    let trader1stocks4 = await companies.addStockDashboard(trader1._id, company5._id);
    let trader1stocks5 = await companies.addStockDashboard(trader1._id, company9._id);
    let trader1stocks6 = await companies.addStockDashboard(trader1._id, company23._id);
    let trader1stocks7 = await companies.addStockDashboard(trader1._id, company21._id);
    let trader2stocks1 = await companies.addStockDashboard(trader2._id, company2._id);
    let trader2stocks2 = await companies.addStockDashboard(trader2._id, company3._id);
    let trader2stocks3 = await companies.addStockDashboard(trader2._id, company4._id);
    let trader2stocks4 = await companies.addStockDashboard(trader2._id, company7._id);
    let trader3stocks1 = await companies.addStockDashboard(trader3._id, company8._id);
    let trader3stocks2 = await companies.addStockDashboard(trader3._id, company18._id);
    let trader3stocks3 = await companies.addStockDashboard(trader3._id, company19._id);
    let trader3stocks4 = await companies.addStockDashboard(trader3._id, company20._id);
    let trader3stocks5 = await companies.addStockDashboard(trader3._id, company21._id);
    let trader4stocks1 = await companies.addStockDashboard(trader4._id, company22._id);
    let trader4stocks2 = await companies.addStockDashboard(trader4._id, company1._id);
    let trader4stocks3 = await companies.addStockDashboard(trader4._id, company4._id);
    let trader5stocks1 = await companies.addStockDashboard(trader5._id, company7._id);
    let trader5stocks2 = await companies.addStockDashboard(trader5._id, company8._id);
    let trader5stocks3 = await companies.addStockDashboard(trader5._id, company10._id);
    let trader5stocks4 = await companies.addStockDashboard(trader5._id, company12._id);
    let trader5stocks5 = await companies.addStockDashboard(trader5._id, company14._id);
    let trader5stocks6 = await companies.addStockDashboard(trader5._id, company16._id);
    let trader5stocks7 = await companies.addStockDashboard(trader5._id, company18._id);
    let trader6stocks1 = await companies.addStockDashboard(trader6._id, company20._id);
    let trader6stocks2 = await companies.addStockDashboard(trader6._id, company22._id);
    let trader6stocks3 = await companies.addStockDashboard(trader6._id, company24._id);
    let trader6stocks4 = await companies.addStockDashboard(trader6._id, company1._id);
    let trader6stocks5 = await companies.addStockDashboard(trader6._id, company3._id);
    let trader6stocks6 = await companies.addStockDashboard(trader6._id, company5._id);
    let trader7stocks1 = await companies.addStockDashboard(trader7._id, company7._id);
    let trader7stocks2 = await companies.addStockDashboard(trader7._id, company9._id);
    let trader7stocks3 = await companies.addStockDashboard(trader7._id, company11._id);
    let trader7stocks4 = await companies.addStockDashboard(trader7._id, company13._id);
    let trader7stocks5 = await companies.addStockDashboard(trader7._id, company15._id);
    let trader7stocks6 = await companies.addStockDashboard(trader7._id, company17._id);
    let trader7stocks7 = await companies.addStockDashboard(trader7._id, company19._id);
    let trader8stocks1 = await companies.addStockDashboard(trader8._id, company21._id);
    let trader8stocks2 = await companies.addStockDashboard(trader8._id, company23._id);
    let trader8stocks3 = await companies.addStockDashboard(trader8._id, company25._id);
    let trader8stocks4 = await companies.addStockDashboard(trader8._id, company1._id);

    let following6 = await traders.addFollowingArray(trader1._id, "jslang@stevens.edu");
    let following7 = await traders.addFollowingArray(trader1._id, "jlake@stevens.edu");
    let following2 = await traders.addFollowingArray(trader1._id, "bhardway@stevens.edu");

    let following10 = await traders.addFollowingArray(trader2._id, "jslang@stevens.edu");

    let following15 = await traders.addFollowingArray(trader3._id, "jslang@stevens.edu");
    let following3 = await traders.addFollowingArray(trader1._id, "jlake@stevens.edu");

    let following16 = await traders.addFollowingArray(trader4._id, "bhardway@stevens.edu");
    let following4 = await traders.addFollowingArray(trader1._id, "jlake@stevens.edu");

    let following20 = await traders.addFollowingArray(trader5._id, "jslang@stevens.edu");
    let following21 = await traders.addFollowingArray(trader5._id, "jlake@stevens.edu");

    await db.serverConfig.close();
}

main().catch(console.log); 
