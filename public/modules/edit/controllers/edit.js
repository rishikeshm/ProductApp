/**
 * Created by Rishikesh Madake.
 * Controller to insert a product after the form is filled.
 */
angular.module('edit')
	.controller('EditCtrl', ['$scope', 'productApi', 'localStorage', function($scope, productApi, localStorage){
		$scope.message = {'showInsertMsg' : false};
		$scope.product = {};
		$scope.error = {'showSellingPriceMsg' : false};

		$scope.$watch(
			function(){ return $scope.product.selling_price;},
			function(newVal, oldVal){
				if($scope.product.selling_price <= $scope.product.cost_price) {
					$scope.error.sellingPriceMsg = 'Selling Price needs to be higher than Cost Price.';
					$scope.error.showSellingPriceMsg = true;
				}
				else{
					$scope.error.showSellingPriceMsg = false;
				}
			}
		);
		$scope.submitProductEntryForm = function(valid) {
			if($scope.product.selling_price <= $scope.product.cost_price) {
				$scope.error.sellingPriceMsg = 'Selling Price needs to be higher than Cost Price.';
				$scope.error.showSellingPriceMsg = true;
			}
			else {
				$scope.product._id = $scope.product.name.toLowerCase();
				/**
					Call api to insert the product document in mongodb
				*/
				$scope.promise = productApi.insertProductDocument($scope.product);
				$scope.error.showSellingPriceMsg = false;
				
				return $scope.promise.then(
					function(response, status){
						$scope.message.insertMsg = 'Inserted New Product Successfully';
						$scope.message.showInsertMsg = true;

						/**
							Update the localStorage cache for this product in case the user
							has already searched for products by entering a substring of this 
							new product in search text box, on Home page.
						*/
						localStorage.checkAndAddProductName($scope.product.name);

						return $scope.message.insertMsg;
					},
					function(response, status){
						console.log('Error inserting :  ' + JSON.stringify(response));
						$scope.message.insertMsg = 'Error Inserting New Product - [ Err Code - ' + response.code + ' ] - ' + response.err + ' , Please ensure unique product name!!';
						$scope.message.showInsertMsg = true;
						return $scope.message.insertMsg;
					});
			}
		};

		$scope.reset = function(property) {
			$scope.product[property] = '';
			$scope.message.showInsertMsg = false;
			if(property == 'selling_price') {
				$scope.error.showSellingPriceMsg = false;
			}
		};
	}]);