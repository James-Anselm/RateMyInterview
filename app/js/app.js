'use strict';

/* App Module */

angular.module('rateMyInterview', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/ratings', {templateUrl: 'partials/rating-list.html',   controller: RatingsListCtrl}).
      when('/login', {templateUrl: 'partials/login.html', controller: LoginCtrl}).
      otherwise({redirectTo: '/login'});
}]);
