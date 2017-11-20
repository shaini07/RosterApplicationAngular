'use strict';
angular
    .module('routes', ['ngRoute'])
    .config(config);
function config($routeProvider) {
    $routeProvider
        .when('/Login', {
            templateUrl: 'views/Login/Login.htm',
            controller: 'LoginController'
        })
		.when('/SearchRoaster', {
		    templateUrl: 'views/Home/SearchRoaster.htm',
		    controller: 'SearchRoasterController'
		})
		.when('/AddRoaster', {
		    templateUrl: 'views/Home/AddRoaster.htm',
		    controller: 'AddRoasterController'
		})
		.when('/EditRoaster/:roasterId', {
		    templateUrl: 'views/Home/EditRoaster.htm',
		    controller: 'EditRoasterController'
		})
		.when('/AddProfile', {
		    templateUrl: 'views/Admin/AddProfile.htm',
		    controller: 'AddProfileController'
		})
		.when('/EditProfile/:employeeId', {
		    templateUrl: 'views/Admin/EditProfile.htm',
		    controller: 'EditProfileController'
		})
        .when('/MyProfile/:employeeId', {
            templateUrl: 'views/Admin/MyProfile.htm',
            controller: 'MyProfileController'
        })
		.when('/SearchProfile', {
		    templateUrl: 'views/Admin/SearchProfile.htm',
		    controller: 'SearchProfileController'
		})
        .when('/ChangePassword', {
            templateUrl: 'views/Login/ChangePassword.htm',
            controller: 'ChangePasswordController'
        })
        .when('/NewRegistration', {
            templateUrl: 'views/Login/NewRegistration.htm',
            controller: 'NewRegistrationController'
        })
        .when('/MyRoster', {
            templateUrl: 'views/Home/MyRoster.htm',
            controller: 'MyRosterController'
        })
         .when('/MyRequests', {
             templateUrl: 'views/Home/MyRequests.htm',
             controller: 'MyRequestController'
         })
        .when('/SearchAllowance', {
            templateUrl: 'views/Home/SearchAllowance.htm',
            controller: 'SearchAllowanceController'
        })
        .when('/AddAllowance', {
            templateUrl: 'views/Home/AddAllowance.htm',
            controller: 'AddAllowanceController'
        })
        .when('/EditAllowance', {
            templateUrl: 'views/Home/EditAllowance.htm',
            controller: 'EditAllowanceController'
        })
        .when('/MyAllowance', {
            templateUrl: 'views/Home/MyAllowance.htm',
            controller: 'MyAllowanceController'
        })
		 .otherwise({
		     redirectTo: '/Login'
		 });
}
