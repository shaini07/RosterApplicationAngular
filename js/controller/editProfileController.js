'use strict';
angular
    .module('editProfileCtrl', ['angularjs-datetime-picker', 'ngStorage', 'ui.filter', 'ngLoader'])
	.controller('EditProfileController', ['$rootScope', '$scope', '$localStorage', '$http', '$routeParams', '$sessionStorage', '$timeout', function ($rootScope, $scope, $localStorage, $http, $routeParams, $sessionStorage, $timeout) {
	    //Checking BrowserSession 
	    if (checkSessionStorage($sessionStorage, $scope, $localStorage, $rootScope)) {
	        pageInitialize($scope, $rootScope, $localStorage, 'EditUser');
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
	                            successMessge("Profile Updated Succesfully", "Edit Profile", "#/SearchProfile");
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
function loadProfilebyId($scope, $routeParams) {
    var responseData = [];
    var profileData = { "profileId": $routeParams.employeeId };
    //Do Ajax post Call
    responseData = DoAJAXCall("POST", profileByIdService, JSON.stringify(profileData));
    $scope.firstName = responseData[0].FirstName;
    $scope.lastName = responseData[0].LastName;
    $scope.employeeId = responseData[0].EmployeeId;
    $scope.emailAddress = responseData[0].EmailAddress;
    $scope.contactNumber = responseData[0].ContactNumber;
    $scope.altContactNumber = responseData[0].AlternateNumber;  
    $scope.address1 = responseData[0].Address1;
    $scope.address2 = responseData[0].Address2;
    $scope.landmark = responseData[0].Landmark;
    $scope.city = responseData[0].City;
    $scope.zip = responseData[0].Zip;    
    $scope.country = responseData[0].Country;   
    $scope.manager = responseData[0].TeamManagerName;
    $scope.mappingId = responseData[0].Mapping_Id;
    $scope.roleInfo = { "Role_Id": responseData[0].Role_Id, "RoleName": responseData[0].RoleName };    
    $scope.team = { "Team_Id": responseData[0].Team_Id, "RoleName": responseData[0].TeamName };
}