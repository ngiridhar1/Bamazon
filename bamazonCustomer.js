// npm requirements
var inquirer = require("inquirer");

var mysql = require("mysql");

// my password for mysql db connection - hidden
var pw = require("./pw.js");

// create mysql connection
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: pw.pw,
	database: "bamazon_db"
});


// connect to db
connection.connect(function(error){
	if (error) throw error;
	// welcome customer
	console.log("\n-----------------------------------------------------------------" 
		+ "\nWelcome to Bamazon! Check out what we've got for you!\n" 
		+ "-----------------------------------------------------------------\n");
	// start the app
	welcome();
});

// initial screen upon app open
function welcome() {
	// ask customer what they'd like to do
	inquirer.prompt([
		{
		 name: "action",
		 type: "list",
		 choices: ["View items for sale", "Leave the store"],
		 message: "Please select what you would like to do."
		}
	]).then(function(action) {
		// if user wants to view items, run the view items function
		if (action.action === "View items for sale") {
			console.log("View")
			viewItems();
			// if user wants to leave, run exit function
		} else if (action.action === "Leave the store") {
			console.log("\nThanks for stopping by! Have a good day.");
			connection.end();
			
		}
	});
}

// view items function
function viewItems() {
	console.log("Inside log")
	// save my sql query
	var query = "SELECT * FROM products";
	// query db display results
	connection.query(query, function(error, results) {
	// if error, tell us
	if (error) throw error;
	// call the console table function to build/display the items table
	  for(var i = 0; i<results.length;i++){
	     console.log("ID: " + results[i].item_id + " | " + "Product: " + results[i].product_name + " | " + "Department: " + results[i].department_name + " | " + "Price: " + results[i].price + " | " + "QTY: " + results[i].stock_quantity);
	     console.log('--------------------------------------------------------------------------------------------------')
	  }
 	 // ask customer what they'd like to buy and how much qty
	inquirer.prompt([
	{
	 name: "id",
	 message: "Please enter the ID of the item that you would like to purchase.",
	// validates that the id is a number greater than 0 and less than/equal to 
	// the number of items
	 validate: function(value) {
	    if (value > 0 && isNaN(value) === false && value <= results.length) {
		return true;
	    }
		return false;
	  }
	},
	{
	 name: "qty",
	 message: "What quantity would you like to purchase?",
	 // validate the quantity is a number larger than 0
	 validate: function(value) {
	   if (value > 0 && isNaN(value) === false) {
		return true;
	   }
	   return false;
	 }
	}
	]).then(function(transaction) {
	// init itemQty, itemPrice, itemName vars
	 var itemQty;
	 var itemPrice;
	 var itemName;
	 var productSales;
	  // set above vars equal to results where the user id matches db id
	 for (var j = 0; j < results.length; j++) {
	   if (parseInt(transaction.id) === results[j].item_id) {
	      itemQty = results[j].stock_quantity;
		itemPrice = results[j].price;
		itemName = results[j].product_name;
		productSales = results[j].product_sales;
	    }
	  }
	// if user tries to buy more qty than db has available, tell them no, run the
	// welcome function again
	if (parseInt(transaction.qty) > itemQty) {
		console.log("\nInsufficient inventory for your requested quantity. We have " 
					+ itemQty + " in stock. Try again.\n");
	   welcome();
	} 
	  // if user tries to buy equal/less qty than db has available, tell them yes,
	  // update the db to reduce qty by customer purchase amt, update product sales
	  // with revenue from the sale
	else if (parseInt(transaction.qty) <= itemQty) {
				console.log("\nCongrats! You successfully purchased " + transaction.qty 
					+ " of " + itemName + ".");
	       lowerQty(transaction.id, transaction.qty, itemQty, itemPrice);
		   salesRevenue(transaction.id, transaction.qty, productSales, itemPrice);
	      }
	});
   });
}
  
// reduce stock qty function
function lowerQty(item, purchaseQty, stockQty, price) {
	// query with an update, set stock equal to stockqty - purchase qty
	// where the item_id equals the id the user entered
	connection.query(
		"UPDATE products SET ? WHERE ?", 
		[
			{
				stock_quantity: stockQty - parseInt(purchaseQty)
			},
			{
				item_id: parseInt(item)
			}
		],
		// throw error if error, else run displayCost
		function(error, response) {
			if (error) throw error;
	});
}

// add sales rev function
function salesRevenue(item, purchaseQty, productSales, price) {
	var customerCost = parseInt(purchaseQty) * price;
	// query with an update, set product rev equal to current product sales + 
	// purchase qty * price where the item id equals the id the user entered
	connection.query(
		"UPDATE products SET ? WHERE ?", 
		[
			{
				product_sales: productSales + customerCost
			}, 
			{
				item_id: parseInt(item)
			}
		], 
		function(error, response) {
			if (error) throw error;
			// log it fixed to 2 decimals to tell customer what their price was
			console.log("The total price is $" + customerCost.toFixed(2) 
				+ ". Gotta love no sales tax. Thanks for you purchase!\n");
			// run welcome function
			welcome();
	
		})};