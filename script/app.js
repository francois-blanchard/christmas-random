var app = angular.module('christmas',[]);

app.service('User', function(){
  $this = this
  $this.users = [
    {
      "username": "François",
      "picked": false
    },
    {
      "username": "Émilie",
      "picked": false
    }
  ];
  $this.all = function(){
    return $this.users;
  };
});

app.controller('UsersController', function($scope, User){

  // STATUS : 'init','pick','end'
  $scope.users = User.all();
  $scope.newUser = {};
  $scope.pick_status = "pick";

  $scope.addUser = function(){
    $scope.newUser.picked = false;
    $scope.users.push($scope.newUser);
    $scope.newUser = {};
    $scope.pick_status = "pick";
  };

  $scope.pick_random_user = function(){
    var remaining_user = _.where($scope.users, { 'picked': false });
    $scope.user_picked = remaining_user[_.random(remaining_user.length-1)];
    $scope.user_picked.picked = true;
    if(remaining_user.length == 1){
      $scope.pick_status = "end";
    }
  };

});
