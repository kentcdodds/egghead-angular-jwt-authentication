(function() {
  'use strict';

  var app = angular.module('app', []);

  app.constant('API_URL', 'http://localhost:3000');

  app.controller('MainCtrl', function MainCtrl(UserFactory, RandomUserFactory) {
    'use strict';
    var vm = this;

    // assignment
    vm.login = login;
    vm.getRandomUser = getRandomUser;

    // View Model functions
    function login(username, password) {
      UserFactory.login(username, password).then(function(response) {
        console.log(response);
      }, handleError);
    }

    function getRandomUser() {
      RandomUserFactory.getRandomUser().then(function(response) {
        vm.randomUser = response.data;
      }, handleError);
    }


    // UTIL FUNCTIONS
    function handleError(response) {
      alert('Error: ' + response.data);
    }
  });

  app.factory('RandomUserFactory', function RandomUserFactory($http, API_URL) {
    'use strict';
    return {
      getRandomUser: getRandomUser
    };

    function getRandomUser() {
      return $http.get(API_URL + '/random-user');
    }
  });

  app.factory('UserFactory', function LoginFactory($http, API_URL) {
    'use strict';
    return {
      login: login
    };

    function login(username, password) {
      var loginInfo = {
        username: username,
        password: password
      };
      return $http.post(API_URL + '/login', loginInfo);
    }
  });

})();