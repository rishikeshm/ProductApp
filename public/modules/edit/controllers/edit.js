/**
 * Created by Rishikesh Madake.
 * Controller to insert a product after the form is filled.
 */
angular.module('edit')
	.controller('EditCtrl', ['$scope', 'productApi', function($scope, productApi){
		$scope.message = {'showInsertMsg' : false};
		$scope.product = {};
		$scope.error = {'showSellingPriceMsg' : false};

		$scope.submitProductEntryForm = function(valid) {
			if($scope.product.selling_price < $scope.product.cost_price) {
				$scope.error.sellingPriceMsg = 'Selling Price needs to be higher than Cost Price.';
				$scope.error.showSellingPriceMsg = true;
			}
			else {
				// Call api to insert the product document in mongodb
				$scope.promise = productApi.insertProductDocument($scope.product);

				return $scope.promise.then(
					function(response, status){
						$scope.message.insertMsg = 'Inserted New Product Successfully';
						$scope.message.showInsertMsg = true;
						return $scope.message.insertMsg;
					},
					function(response, status){
						$scope.message.insertMsg = 'Error Inserting New Product';
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