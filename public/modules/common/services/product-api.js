/**
* Created by rishikesh madake.
* @description:
* # productApi factort for CRUD operations.
*/
angular.module('common')
	.factory('productApi', ['$http', '$q', function($http, $q){

		var get = function(productName) {
			return $http({
				url: '/api/products/' + productName,
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
				get(productName)
					.success(function(response, status) {
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
			}

		};
	}])