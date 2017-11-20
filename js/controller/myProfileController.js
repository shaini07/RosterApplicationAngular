'use strict';
angular
    .module('myProfileCtrl', ['angularjs-datetime-picker', 'ngStorage', 'ui.filter', 'ngLoader'])
	.controller('MyProfileController', ['$rootScope', '$scope', '$localStorage', '$http', '$routeParams', '$sessionStorage', '$timeout', function ($rootScope, $scope, $localStorage, $http, $routeParams, $sessionStorage, $timeout) {
	    //Checking BrowserSession 
	    if (checkSessionStorage($sessionStorage, $scope, $localStorage, $rootScope)) {
	        pageInitialize($scope, $rootScope, $localStorage, 'MyProfile');
	        //Loading the loader
	        $scope.working = true;
	        //Loading Team Names
	        $timeout(function () { loadTeams($scope, $http); $scope.working = false; }, 2000);
	        //Loading the loader
	        $scope.working = true;
	        //Loading Roles
	        $timeout(function () { loadRoles($scope, $http); $scope.working = false; }, 2000);
	        //Loading the loader
	        $scope.working = true;
	        //Loading Profile details
	        $timeout(function () { loadProfilebyId($scope, $routeParams); $scope.working = false; }, 2000);
	        $scope.submit = function () {
	            $scope.$broadcast('show-errors-check-validity');
	            if ($scope.editUserForm.$valid) {
	                //Loading the loader
	                $scope.working = true;
	                $timeout(function () {
	                    var status = 1;
	                    var createdBy = "Admin";
	                    var editprofileData = {
	                        "mappingId": $scope.mappingId,
	                        "profileId": $routeParams.employeeId,
	                        "teamId": $scope.team.Team_Id,
	                        "roleId": $scope.roleInfo.Role_Id,
	                        "firstName": $scope.firstName,
	                        "lastName": $scope.lastName,
	                        "emailAddress": $scope.emailAddress,
	                        "employeeId": $scope.employeeId,
	                        "contactNumber": $scope.contactNumber,
	                        "alternateNumber": $scope.altContactNumber,
	                        "address1": $scope.address1,
	                        "address2": $scope.address2,
	                        "landmark": $scope.landmark,
	                        "city": $scope.city,
	                        "zip": $scope.zip,
	                        "country": $scope.country,
	                        "createdBy": createdBy,
	                        "active": status,
	                        "newPassword": '',
	                        "confirmPassword": ''
	                    };
	                    responseData = DoAJAXCall("POST", editProfileService, JSON.stringify(editprofileData));
	                    if (responseData != null) {
	                        if (responseData[0].Profile_Id != 0) {
	                            $scope.working = false;
	                            if ($sessionStorage.profileInfo.RoleName != "Report Admin") {
	                                successMessge("Profile Updated Succesfully", "My Profile", "#/AddRoaster");
	                            }
	                            else {
	                                successMessge("Profile Updated Succesfully", "My Profile", "#/SearchRoaster");
	                            }
	                        }
	                    }
	                }, 2000);
	            }

	        };
	        //Loading Manager Name Based on Team Name
	        $scope.loadManagerList = function (teamId) {
	            //Loading the loader
	            $scope.working = true;
	            $timeout(function () {
	                var data = $scope.teamLst;
	                var teamInfo = data.filter(
                         function (data) { return data.Team_Id == teamId }
                    );
	                if (teamInfo.length > 0) {
	                    $scope.manager = teamInfo[0].TeamManagerName;
	                }
	                $scope.working = false;
	            }, 2000);
	        };
	    }
	}]);