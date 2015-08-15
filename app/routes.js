// get the Products model
var Products = require('./models/products');
module.exports = function(app) {
	// server routes ===============================
	// handle things like api calls
	// authentication routes

	/** 
		Getting Products
	*/
	app.get('/api/products/:productName', function(req, res){
		var productName = req.params.productName;
		var query = {"name" : {$regex : productName, $options: "i"}};

		Products.find(query, function(err, products){
			// if err retrieving products send error
			if (err) {
				res.status(500).send(err);
			}
			res.json(products);

		});

	});

	/** 
		Updating Product
	*/
	app.put('/api/products', function(req, res){
		var query = {"_id" : req.body._id};
		Products.update(query, req.body, function(err, doc) {
			if (err) {
				res.status(500).send(err);
			}
			res.send("Success");
		});	

	});

	/** 
		Inserting Product
	*/
	app.post('/api/products', function(req, res){
		var product = new Products(req.body);

		product.save(function(err){
			if (err) {
				res.status(500).send(err);
			}
			res.send("Success");
		});

	});
	// frontend routes ============================
	// route to handle all angular js requests
	app.get('*', function(req, res){
		res.sendfile('./public/index.html'); // load our public/index.html file
	});
}