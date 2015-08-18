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
	.controller('HomeCtrl', ['$scope', 'productApi', 'localStorage', function($scope, productApi, localStorage){
		$scope.noResults = false;
		$scope.updateSuccessMessage = false;
		$scope.updateErrorMessage = false;

		$scope.productModel = productApi.model.get();
		if ($scope.productModel != undefined && $scope.productModel.hasOwnProperty('_id')) {
			$scope.asyncProductSelected = angular.copy($scope.productModel);
			$scope.productName = $scope.asyncProductSelected.name;
			$scope.sellingPrice = $scope.asyncProductSelected.selling_price;
			$scope.productSelected = $scope.asyncProductSelected.name;
		}

		$scope.getProductDetails = function(typedProductName) {
			$scope.promise = productApi.getProductDetails(typedProductName);
			return $scope.promise.then(
				function(response, status){
					return response;
				},
				function(response, status){
					console.log('Error retrieving products!!!');
					return response;
				});
		};

		$scope.getProductNames = function(typedProductName) {
			$scope.promise = productApi.getProductNames(typedProductName);
			return $scope.promise.then(
				function(response, status){
					localStorage.addProductName(typedProductName, response);
					return response;
				},
				function(response, status){
					console.log('Error retrieving products!!!');
					return response;
				});
		};

		$scope.getProducts = function(typedProductName) {
			var products = localStorage.getProductNames(typedProductName);
			if (products.length > 0) {
				return products;
			}
			else {
				return $scope.getProductNames(typedProductName);
			}
		};

		$scope.onSelect = function($item, $model, $label){
			$scope.getProductDetails($item.name)
				.then(function(products){
					$scope.asyncProductSelected = angular.copy(products);
					/**
						Caching the productDetails object in a service factory object
						so that when user comes back to Home page after navigating to Edit
						he is shown the same state.
					*/
					productApi.model.set($scope.asyncProductSelected);

					$scope.productName = $item.name;
					$scope.sellingPrice = products.selling_price;
				});
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
			$scope.resetMessages();
			if($scope.validateFields()) {
				if ($scope.asyncProductSelected != undefined && typeof($scope.asyncProductSelected) == 'object') {

					/**
						We need to make a copy of original asyncProductSelected, so that if there is
						any error updating the product with new selling_price / product name
						then we need to revert to this original asyncProductSelected
						and if the updation in db is successful then asyncProductSelected also 
						needs to be updated with productCopy as productCopy always stores the updated 
						product details.
					*/
					var productCopy = angular.copy($scope.asyncProductSelected);				
					
					/**
						Take the new selling_price (incase modified) and productName(incase changed)
						If user has changed both productName and selling_price and hit enter on selling price
						or product name textbox , then we need to save both these values and update it.
					*/
					productCopy.selling_price = $scope.sellingPrice;
					productCopy.name = $scope.productName;

					/**
						Since we are making product name unique so we store it in _id field of db in lower case
						e.g Dell will be stored as dell. Uniqueness is case-insensitive(i.e the string
						"Dell" is same as "dell" or "dEll" etc.
					*/
					productCopy._id = productCopy.name.toLowerCase();
					
					$scope.promise = productApi.updateProductDetails(productCopy);
					return $scope.promise.then(
						function(response, status){
							$scope.updateSuccessMessage = true;							

							/**
								Update localStorage with new Product Name and remove old Product name
							*/
							if ($scope.asyncProductSelected.name != productCopy.name)
								localStorage.updateProductNames($scope.asyncProductSelected.name, productCopy.name);

							$scope.asyncProductSelected = angular.copy(productCopy);

							/**
								Update the Search text box (ng-model = productSelected) with the 
								new updated value of product name
							*/
							$scope.productSelected = $scope.asyncProductSelected.name;

							/**
								Save the updated product in factory cache. 
							*/
							productApi.model.set($scope.asyncProductSelected);


							return response;
						},
						function(response, status){
							$scope.updateErrorMessage = true;
							console.log('Error updating product' + response);
						});
					
				} //end if ($scope.asyncProductSelected != undefined.....
			} //end if($scope.validateFields()) 

		};
		/*
			We need to watch Product Search box, since if we delete the product name
			then the Product Name and Selling Price text box should blank
			and validation message if any should be removed.
		*/
		$scope.$watch(
			function(){
				return $scope.productSelected;
			},
			function(newVal, oldVal){
				if(newVal == '' || newVal == undefined){
					$scope.asyncProductSelected = {};
					$scope.productName = undefined;
					$scope.noProductName = false;
					$scope.sellingPrice = undefined;
					$scope.noSellingPrice = false;
					$scope.updateSuccessMessage = false;
					$scope.updateErrorMessage = false;
					productApi.model.set({});
					$scope.noResults = false;
				}
			});
			
			$scope.resetMessages = function() {
				$scope.updateSuccessMessage = false;
				$scope.updateErrorMessage = false;
			};
	}])