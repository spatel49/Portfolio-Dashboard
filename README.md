# CS546 Web Programming Final Project, Team 5

# How to Run  
After cloning or downloading the files, move to the directory that contains ```app.js```.

Use the following command to install the dependencies:  
```
npm install
```  
  
In order to populate the website with data, use the following command to run the seed task:  
```
npm run seed
```  
  
Run the project  
```
npm start
```  

The website will be hosted on localhost:3000  

## Information for Logging In
Email Address: asmith@stevens.edu | Password: abcd

You can also check the account information of other users that are created in ```seed.js```.

## Important Note:
It may take between 40-90 seconds to run the seed because we add 8 users/traders to the database using the addNewTrader function and the addNewTrader function hashes the password, which is most likely why the seed task takes a while to complete. So, if the seed task takes a while to complete, please wait for a minute or two.

We used the Finnhub API and the API provides 60 API calls per minute. Some of the functions in ```seed.js``` make calls to the Finnhub API. For some reason, if you receive an error about exceeding the limit of API calls when running the seed or browsing through our website, please wait for a minute and try again.

We mainly used Google Chrome when running and testing our project, so we highly recommend using Google Chrome when running our website.

# Group Members:  
Siddhanth Patel  
Jeffrey Lee  
Adam Farid  
Cheng Cheng  


# Introduction:  
Given the latest rise of retail investors, there have been a wide variety of options available for traders to add and view stocks. However, these options can sometimes be confusing and distracting for new and inexperienced traders. We hope to provide a solution to this issue by building a web application that allows users to select, add, and remove stocks to their dashboard.

# Description:  
This project features a stocks dashboard. Users can login to their account and then select, add, or view stocks that they want to keep track of. Each stock features a brief description of the company and showcases the average review based on users’ opinions. The dashboard uses an api that tracks stocks graph data live. Each individual stock page contains the stock’s overall description such as name, ticker, description, price of stock, market cap, industry, and number of employees. Users will have the ability to comment their opinions on these individual stock pages and provide their rating out of 5 stars for all other users to see. The database will store the company names, stock symbols, description, and users’ average ratings.

# Core Features:  

## Landing Page:  
-Explains that the website is a service for people to create and store their stocks dashboard  
-Leads to log-in page  

## Log-in Page:  
-Login screen  
-Users can register for an account using their email address  

## Dashboard:  
-Displays list of stocks and their price  
-Users can add or remove stocks from their list  
-Each stock will display number of stars (out of 5) based on average users  
-Users will be able to remove stock from the dashboard by clicking the remove button.  
-Users will be able to sort their dashboard based on price, name, or review.  

## Stocks Listing Page:  
-Users will be able to add stocks to their dashboard.  
-Each company listing will have a brief description and overall buyer rating.  
-Users will be able add stocks to their dashboard directly by clicking the add button next to a stock listing.  
-Ability to sort by price, name, or average review.  
-Ability to search for stocks not in the top 25. If there are none available, there will be a message prompted to the user “Not currently available.”  

## Individual Users History Feature:  
-Contains a log of past activity of the User (additions/removals of different stocks and any reviews added)  

## Individual Stock Pages:  
-Provides an overview of the company profile (name, ticker, description, price of stock, market cap, industry, number of employees).  
-Users will be able to submit reviews for all other users to see.  
-Users will be able to add the stock to their dashboard  
-Provides the average rating out of 5 stars among all reviewers.  

## Stock Suggestions Page:
-Shows users a list of recommended stocks based on the ones that they have picked in their dashboard.
