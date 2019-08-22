﻿## Bamazon
A mock storefront with departments and products.  

## Motivation
A Node app for customers to view items and place orders,In the future upgrade for managers to perform inventory control and add new products, and for supervisors to track department profitability and add new departments. 
 
 

## Tech/framework used
<b>Built with</b>
- [Node.js](https://nodejs.org/en/)
- Javascript
- [MySQL](https://www.mysql.com/)
- [inquirer](https://www.npmjs.com/package/inquirer)

## Features
- Inquirer provides an easy to use UI with prompts asking the user what they would like to do. 
- Customers may purchase products from the available products in the database.  
- Console table organizes product, inventory, and department data in a concise manner within the CLI. 
- User input validation is present to ensure that customers cannot purchase more inventory than Bamazon has in stock, managers don't add products with no inventory, and supervisors cannot add departments that already exist.

## Installation
- Install [Node js](https://nodejs.org/en/)
- Clone the Bamazon repository to your machine
- Open CLI, navigate to the cloned repository, and run the following to install the npm package dependencies 

		npm install

- Open MySQL Workbench, Open the "bamazon.sql" script from the cloned repo, and run it to set up the database and base product/department data.
- Next, within the cloned repo, you'll need to create a pw.js file with the following code, and add your password to access your root server to that file. This file is a dependency for the app. If you do not require a password to access your root, simply leave the pw property as an empty string.


```javascript
var pwd = {
	pw: "YOUR PASSWORD HERE"
}
	
module.exports = pwd;
```

- You're ready to go!

## How to use?
**Customers**
- Run the following in your CLI while inside your cloned repo directory

		node bamazonCustomer.js

- Select from the resulting screen whether you would like to view items or leave.
- If you select view items, input and enter the item id that you would like to purchase
- Input and enter the quantity that you would like to buy
- If you would like to buy another item, repeat
- If you would like to leave, click exit

