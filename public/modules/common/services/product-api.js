/**
* Created by rishikesh madake.
* @description:
* # productApi factort for CRUD operations.
*/
angular.module('common')
	.factory('productApi', ['$http', '$q', function($http, $q){

		var model = {

		};

		var getDetails = function(productName) {
			return $http({
				url: '/api/productDetails/' + productName,
				method: 'GET'
			});
		};

		var getNames = function(productName) {
			return $http({
				url: '/api/productNames/' + productName,
				method: 'GET'
			});
		};

		var update = function(productDocument) {
			return $http({
				url: '/api/products/',
				method: 'PUT',
				data: productDocument
			});
		};

		var insert = function(productDocument) {
			return $http({
				url: '/api/products/',
				method: 'POST',
				data: productDocument
			});
		};

		return {
			getProductDetails : function(productName) {
				var q = $q.defer();
				getDetails(productName)
					.success(function(response, status) {
						console.log('GOt Product Details : ' + JSON.stringify(response));
						q.resolve(response, status);
					})
					.error(function(response, status){
						q.reject(response, status);						
					});

				return q.promise;
			},

			getProductNames : function(productName) {
				var q = $q.defer();
				getNames(productName)
					.success(function(response, status) {
						console.log('GOt Product names : ' + JSON.stringify(response));
						q.resolve(response, status);
					})
					.error(function(response, status){
						q.reject(response, status);						
					});

				return q.promise;
			},

			updateProductDetails : function(productDocument) {
				var q = $q.defer();
				update(productDocument)
					.success(function(response, status) {
						q.resolve(response, status);
					})
					.error(function(response, status){
						q.reject(response, status);						
					});

				return q.promise;
			},

			insertProductDocument: function(productDocument) {
				var q = $q.defer();
				insert(productDocument)
					.success(function(response, status) {
							q.resolve(response, status);
						})
						.error(function(response, status){
							q.reject(response, status);						
						});
				return q.promise;
			},

			model: {
				set: function(product) {
					model = angular.copy(product);
				},
				get: function() {
					return model;
				}
			}

		};
	}])