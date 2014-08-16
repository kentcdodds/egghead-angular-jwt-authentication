(function() {
  'use strict';
  var app = angular.module('app', []);
  app.controller('MainCtrl', function MainCtrl(UserFactory, RandomUserFactory) {
    'use strict';
    var vm = this;

    // assignment
    vm.login = login;
    vm.logout = logout;
    vm.getProtectedResource = getProtectedResource;

    // initialization
    UserFactory.getUser().then(function(response) {
      vm.user = response.data;
    });

    // View Model functions
    function login(username, password) {
      UserFactory.login(username, password).then(function(response) {
        vm.user = response.data;
      }, handleError);
    }

    function logout() {
      vm.user = null;
      UserFactory.logout();
    }

    function getProtectedResource() {
      RandomUserFactory.getRandomUser().then(function(response) {
        vm.protectedResource = response.data;
      }, handleError);
    }


    // UTIL FUNCTIONS
    function handleError(response) {
      alert('Error: ' + response.data);
    }
  });

  app.factory('UserFactory', function LoginFactory($http) {
    'use strict';
    return {
      getUser: getUser,
      login: login,
      logout: logout
    };

    function getUser() {
      return $http.get('/me');
    }

    function login(username, password) {
      return $http.post('/login', {
        username: username,
        password: password
      });
    }

    function logout() {
      return $http.get('/logout');
    }
  });

  app.factory('RandomUserFactory', function RandomUserFactory($http) {
    'use strict';
    return {
      getRandomUser: getRandomUser
    };

    function getRandomUser() {
      return $http.get('/random-user');
    }
  });
})();