var app = angular.module('christmas',[]);

app.controller('UsersController', ['$scope',function($scope){

  $scope.users = [
    {
      "username": "Test1"
    },
    {
      "username": "Test2"
    }
  ];

}]);
