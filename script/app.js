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
    new User("Corinne",false),
    new User("Corinne & Franck",false),
    new User("Hanna",false),
    new User("Hanna & Nelson",false),
    new User("Émilie",false),
    new User("Émilie & François",false),
    new User("Franck",false),
    new User("Nelson",false),
    new User("François",false)
  ];

  $this.all = function(){
    return $this.users;
  };

  $this.create = function(userName, picked){
    picked = typeof picked !== 'undefined' ? picked : false;
    var newUser = new User(userName,picked);
    $this.users.push(newUser);
  };

  $this.delete = function (user) {
    $this.users.splice($this.users.indexOf(user), 1);
  };

  $this.removeAll = function () {
    $this.users.splice($this.users);
  };

  $this.restart = function () {
    _.mapValues($this.users, function(user) { user.picked = false; });
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

app.controller('UsersController', function($scope, User, $timeout){

  // STATUS : 'init','pick','end'
  $scope.users = User.all();
  $scope.newUser = {};
  $scope.pick_status = "pick";
  $scope.start_app = "start";
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

  $scope.load_picked = function(){
    if($scope.start_app != "load"){
      $scope.start_app = "load";
      $timeout(function(){
        pick_random_user();
      }, 3000);
    }
  };

  pick_random_user = function(){
    $scope.user_picked = User.picked_user();
    $scope.start_app = "set";
    if(User.end_picked()){
      $scope.pick_status = "end";
    }
  };

  $scope.delete_user = function(user){
    User.delete(user);
  };

  $scope.finish_game =function() {
     $scope.start_app = "end";
     $scope.pick_status = "restart";
  };
  $scope.restart_game =function() {
    // STATUS : 'init','pick','end'
    $scope.newUser = {};
    $scope.pick_status = "pick";
    $scope.start_app = "start";
    $scope.error_username = false;
    User.restart();
  };

});
