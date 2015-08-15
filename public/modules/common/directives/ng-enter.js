 /**
  * Created by rishikesh madake.
  * @description:
  * # Used to catch the enter key on input text
  */

 angular.module("common")
   .directive('ngEnterKey', [function() {

     return {
       restrict: 'A',
       link: function($scope, $element, $attrs) {
         $element.bind("keypress", function(event) {
           var keyCode = event.which || event.keyCode;
           // If enter key is pressed
           if (keyCode == 13) {
             $scope.$apply(function() {
               $scope.$eval($attrs.ngEnterKey);
             });
             event.preventDefault();
           }
         });
       }
     };
   }]);