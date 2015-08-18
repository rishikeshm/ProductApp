// get the Products model
var Products = require('./models/products');
var mongoose = require('mongoose');
module.exports = function(app) {
	// server routes ===============================
	// handle things like api calls
	// authentication routes

	/** 
		Getting Product Details
	*/
	app.get('/api/productDetails/:productName', function(req, res){
		var productName = req.params.productName;
		var query = {"name" : productName};

		Products.findOne(query, function(err, products){
			// if err retrieving products send error
			if (err) {
				res.status(500).send(err);
			}
			else {
				res.json(products);
			}

		});

	});
	/** 
		Getting Product Names
	*/
	app.get('/api/productNames/:productName', function(req, res){
		var productName = req.params.productName;
		var query = {"name" : {$regex : productName, $options: "i"}};
		var fields = {"name" : true, "_id" : false};
		Products.find(query, fields, function(err, products){
			// if err retrieving products send error
			if (err) {
				res.status(500).send(err);
			}
			else {
				res.json(products);
			}

		});

	});
	/** 
		Updating Product
	*/
	app.put('/api/products', function(req, res){
		var query = {"ID" : req.body.ID};
		var sellingPrice = req.body.selling_price;
		var productName = req.body.name;
		/**
			First we find the document to update by its ID field and save the doc
			
			From the document found, we check if the name field of document passed in request
			and the name in document found from db are different,
			
			-->> If different, Then we try inserting the updated document that was passed in req.body
			If we get duplicate error , we send error message back
			If document inserted successfully, then we need to remove the old document which was retrieved earlier.
			We have to do this procedure because _id can not be directly updated in db- we get error -
				"code" : 66,
        "errmsg" : "After applying the update to the document {_id: \"dell\" , ...}, 
        					  the (immutable) field '_id' was found to have been altered to _id:

      -->> If the product name is same in req.body and document found in db, then we need to update
      only selling_price. 
		*/
		Products.findOne(query, function(err, doc){

				if (err) {
					console.log('error finding document -> ' + err.message);
					res.status(500).send(err);
				}
				else {

					/* 
						This condition is for updating product name and selling price both
					*/
					if(doc.name != productName) { 
						var product = new Products(req.body);
						product.save(function(error,d){
							if (error) {
								console.log('error inserting doc !!' + error.message);
								res.status(500).send(error.message);
							}
							else {
								Products.remove(doc, function(errRemove){
									if(errRemove) {
										console.log('error removing original doc !! ' + errRemove.message);
										Products.remove(req.body, function(errRemoveNew){
											if(errRemoveNew) {
												res.status(500).send(errRemoveNew.message);
											}
											else{
												res.status(500).send(errRemove.message);
											}
										});								
									}	
									else{
										res.send("Success");								
									}
								});
							}
						});
					}
					else {
						/**
							Just update the selling_price
						*/
						Products.update(query, {$set : {"selling_price" : sellingPrice}}, function(err, updateStatus){
							if(err) {
								res.status(500).send(err.message);
							}
							else {
								console.log(JSON.stringify(updateStatus));
								res.send("Success");
							}
						});
					}
				}
		});

	});
	/** 
		Inserting Product
	*/
	app.post('/api/products', function(req, res){
		var doc = req.body;
		var id = new mongoose.Types.ObjectId();

		doc.ID = id;

		var product = new Products(doc);

		product.save(function(err){
			if (err) {
				console.log('Got an error inserting doc !!' + err.message);
				res.status(500).send(err);
			}
			else {
				res.send("Success");
			}
		});

	});
	// frontend routes ============================
	// route to handle all angular js requests
	app.get('*', function(req, res){
		res.sendfile('./public/index.html'); // load our public/index.html file
	});
}