/**
* Created by Rishikesh Madake.
* @description:
* # Controller for Home Page used for showing Product Details
* # after a product is searched by entering its name on Product Search Box
* # Controller performs validations of fields - selling price and product name
* # It fetches the product information by making an api call to the factory productApi
* # It also makes an api call to the same factory, for updating product information.
*/
angular.module('home')
	.controller('HomeCtrl', ['$scope', 'productApi', function($scope, productApi){
		$scope.noResults = false;
		$scope.updateSuccessMessage = false;
		$scope.updateErrorMessage = false;

		$scope.productModel = productApi.model.get();

		if ($scope.productModel.hasOwnProperty('_id')) {
			$scope.asyncProductSelected = angular.copy($scope.productModel);
			$scope.productName = $scope.asyncProductSelected.name;
			$scope.sellingPrice = $scope.asyncProductSelected.selling_price;
		}

		$scope.getProducts = function(typedProductName) {
			$scope.promise = productApi.getProductDetails(typedProductName);
			$scope.products = [];
			return $scope.promise.then(
				function(response, status){
					return response;
				},
				function(response, status){
					console.log('Error retrieving products!!!');
				});
		};

		$scope.onSelect = function($item, $model, $label){
			$scope.productName = $item.name;
			$scope.sellingPrice = $item.selling_price;
			productApi.model.set($scope.asyncProductSelected);
		};

		$scope.validateFields = function() {
			if ( $scope.sellingPrice == undefined || $scope.sellingPrice == '' || 
				($scope.asyncProductSelected != undefined && typeof($scope.asyncProductSelected) == 'object' && 
						$scope.sellingPrice <  $scope.asyncProductSelected.cost_price ) ) {
				$scope.noSellingPrice = true;
				return false;
			}

			if ($scope.productName == undefined || $scope.productName == '') {
				$scope.noProductName = true;
				return false;
			}
			$scope.noSellingPrice = $scope.noProductName = false;
			return true;
		}

		$scope.updateProducts = function(fieldName, fieldValue) {

			if($scope.validateFields()) {
				if ($scope.asyncProductSelected != undefined && typeof($scope.asyncProductSelected) == 'object') {
					$scope.asyncProductSelected[fieldName] = fieldValue;
					console.log('updateProductSelected -> ' + JSON.stringify($scope.asyncProductSelected));
					$scope.promise = productApi.updateProductDetails($scope.asyncProductSelected);
					return $scope.promise.then(
						function(response, status){
							$scope.updateSuccessMessage = true;
							productApi.model.set($scope.asyncProductSelected);				
							return response;
						},
						function(response, status){
							$scope.updateErrorMessage = true;
							console.log('Error updating product' + response);
						});
				}
			}

		};
		/*
			We need to watch Product Search box, since if we delete the product name
			then the Product Name and Selling Price text box should blank
			and validation message if any should be removed.
		*/
		$scope.$watch(
			function(){
				return $scope.asyncProductSelected;
			},
			function(newVal, oldVal){
				if(typeof(newVal) == 'string'){
					$scope.productName = undefined;
					$scope.noProductName = false;
					$scope.sellingPrice = undefined;
					$scope.noSellingPrice = false;
					$scope.updateSuccessMessage = false;
					$scope.updateErrorMessage = false;
					productApi.model.set({});	
				}
			});
			
			$scope.resetMessages = function() {
				$scope.updateSuccessMessage = false;
				$scope.updateErrorMessage = false;
			};
	}])