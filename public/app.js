(function() {
  'use strict';
  var app = angular.module('app', []);
  app.controller('MainCtrl', function MainCtrl() {
    'use strict';
    var vm = this;
    vm.name = 'World';
  });
})();