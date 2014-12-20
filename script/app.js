var app = angular.module('christmas',[]);

//
// MODELS
//

app.service('User', function(){
  $this = this

  function User(userName, picked) {
    this.userName = userName;
    this.picked = picked;
  };

  $this.users = [
    new User("François",false),
    new User("Émilie",false)
  ];

  $this.all = function(){
    return $this.users;
  };

  $this.create = function(userName, picked){
    picked = typeof picked !== 'undefined' ? picked : false;
    var newUser = new User(userName,picked);
    $this.users.push(newUser);
  };

  $this.picked_user = function(){
    var remaining_user = _.where(this.users, { 'picked': false });
    var user_picked = remaining_user[_.random(remaining_user.length-1)];
    user_picked.picked = true;
    return user_picked;
  };

  $this.end_picked = function(){
    var remaining_user = _.where(this.users, { 'picked': false });
    return remaining_user.length == 0 ? true : false;
  };

});

//
// CONTROLLERS
//

app.controller('UsersController', function($scope, User){

  // STATUS : 'init','pick','end'
  $scope.users = User.all();
  $scope.newUser = {};
  $scope.pick_status = "pick";
  $scope.error_username = false;

  $scope.addUser = function(){
    if ($scope.userForm.$valid) {

      User.create($scope.newUser.userName);

      $scope.newUser = {};
      $scope.pick_status = "pick";
      $scope.error_username = false;

    }else{
      $scope.error_username = true;
    }
    $scope.userForm.$setPristine();
  };

  $scope.pick_random_user = function(){
    $scope.user_picked = User.picked_user();
    if(User.end_picked()){
      $scope.pick_status = "end";
    }
  };

});
