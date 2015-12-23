var app = angular.module('christmas', ['ngRoute']);

//
// ROUTES
//

app.config(function($routeProvider) {
  $routeProvider
  .when('/', {
      templateUrl : 'pages/home.html',
      controller  : 'UsersController'
  })
  .when('/pick', {
      templateUrl : 'pages/pick.html',
      controller  : 'UsersController'
  })
  .when('/list', {
      templateUrl : 'pages/list.html',
      controller  : 'UsersController'
  })
  .otherwise({
    redirectTo: '/'
  });
});

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
    new User("Anne", false),
    new User("Pierre", false),
    new User('Benoît', false),
    new User('François', false)
  ];

  $this.all = function(){
    return $this.users;
  };

  $this.create = function(userName, picked){
    picked = typeof picked !== 'undefined' ? picked : false;
    var newUser = new User(userName,picked);
    $this.users.push(newUser);
    return newUser;
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

app.controller('UsersController', function($scope, User, $timeout, $routeParams){

  // STATUS : 'init','pick','end'
  $scope.users = User.all();
  $scope.newUser = {};
  $scope.error_username = false;
  if(User.end_picked()){
    $scope.start_app = "end";
    $scope.pick_status = "restart";
  }else{
    $scope.start_app = "start";
    $scope.pick_status = "pick";
  }

  $scope.addUser = function(){
    if ($scope.userForm.$valid) {

      var newUser = User.create($scope.newUser.userName);

      $scope.newUser = {};
      $scope.pick_status = "pick";
      $scope.error_username = false;
      Materialize.toast('<i class=\'material-icons\'>recent_actors</i> &nbsp; Vous avez ajouté ' + newUser.userName + ' à la liste des participants', 3000, 'toast-valid')

    }else{
      $scope.error_username = true;
      Materialize.toast('Vous devez renseigner un ou plusieurs prénoms', 3000, 'toast-alert')
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
      finish_game();
    }
  };

  $scope.delete_user = function(user){
    User.delete(user);
    Materialize.toast('<i class=\'material-icons\'>delete</i> &nbsp; Vous avez supprimé ' + user.userName + ' à la liste des participants', 3000, 'toast-valid')
  };

  finish_game =function() {
   $scope.start_app = "end";
   $scope.pick_status = "restart";
  };

  init_game =function() {
    $scope.start_app = "start";
    $scope.pick_status = "pick";
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
