angular.module('common')
	.factory('localStorage', ['$localStorage', function($localStorage){
		
		/*
		localStorage structure 
		{
			'search' : { <----- Search String
				'dell' : {
					'Dell Avenue' : 1,  <--- productName
					'Dell Inspiron' : 1, <--- productName
					'Dell XPS' : 1 <--- productName
				},
				'del' : { <----- Search String
					'Dell Avenue' : 1,
					'Dell Inspiron' : 1,
					'Dell XPS' : 1, 
					'Delcon Avenue' : 1 
				},
				'ipad' : { <----- Search String
					'ipad mini' : 1
				}
			}
		}
		*/

		$localStorage.search  = {};

		var storage = {

			/**
				if on Edit page user enters new product, then the localStorage needs to be updated
				to put this product in the list of cached products, in case - while on Home user had entered
				a substring of this new product name. 
			*/
			checkAndAddProductName: function(productName) {
				if ( Object.keys($localStorage.search).length > 0 ) {
					Object.keys($localStorage.search).forEach(function(searchString){
						var strRegExPattern = '^' + searchString;
						var pattern = new RegExp(strRegExPattern,'i');

						if (productName.match(pattern) != null) {
							$localStorage.search[searchString][productName] = 1;
						}
					})
				}
			},

			addProductName: function(searchString, productNames){
				if (!(searchString in $localStorage.search)){
					$localStorage.search[searchString] = {};
				}
				productNames.forEach(function(product){
					$localStorage.search[searchString][product.name] = 1;
				});
			},

			getProductNames: function(searchString) {
				if (searchString in $localStorage.search) {
					var products = [];
					Object.keys($localStorage.search[searchString]).forEach(function(productName){
						products.push({
								"name" : productName
							});
					});
					return products;
				}
				else 
					return [];
			},

			updateProductNames: function(oldProductName, newProductName) {				
				
				Object.keys($localStorage.search).forEach(function(searchString){

					if(oldProductName in $localStorage.search[searchString]) {
						// Delete the oldProductName from each search string object in localStorage
						delete ($localStorage.search[searchString][oldProductName]);
					}

					/**
						Now check for whether the searchString (for e.g 'del') is present in newProductName
						if present, then Add an entry for newProductName in searchString object in 
						localStorage.
					*/
					var strRegExPattern = '^' + searchString;
					var pattern = new RegExp(strRegExPattern,'i');

					if (newProductName.match(pattern) != null) {
						$localStorage.search[searchString][newProductName] = 1;
					}
				});
				
			}

		};

		return storage;

	}]);
