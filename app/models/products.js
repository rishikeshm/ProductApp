// get mongoose module
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var productSchema = new Schema({
	_id: String,
	ID : String,
	name: String,
	cost_price : Number,
	selling_price : Number,
	units: Number
});
// define Product Model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Product', productSchema);