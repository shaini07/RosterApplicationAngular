'use strict';
angular
    .module('loginCtrl', ['ngStorage', 'ngLoader'])
    .controller('LoginController', ['$scope', '$rootScope', '$location', '$localStorage', '$sessionStorage', '$timeout', function ($scope, $rootScope, $location, $localStorage, $sessionStorage, $timeout) {
        //Clearing all values 
        $sessionStorage.$reset();
        //Rendering object and controls 
		pageInitialize($scope,$rootScope,$localStorage,'Login');
		$scope.submit = function () {		    
		    $scope.working = true;
            //Broad Casting the Validation to the Form
			$scope.$broadcast('show-errors-check-validity');    
			if ($scope.userForm.$valid) {
			    var responseData = [];
                //Construct the JSON Object
			    var loginData = { "emailAddress": $scope.user.email, "password": $scope.user.password };
			    //Do Ajax post Call			  			    
			    $timeout(function () {
			        responseData = DoAJAXCall("POST", loginService, JSON.stringify(loginData)); 
			        if (responseData != null && responseData != undefined) {
			            if (responseData.length > 0) {
			                //Checking Role Access from JSON response
			                $rootScope.isAdmin = (responseData[0].RoleName == "Manager") ? true : false;
			                $rootScope.isReportAdmin = (responseData[0].RoleName == "Report Admin") ? true : false;
			                $rootScope.loggedInName = responseData[0].FirstName;
			                $rootScope.loggedInId = responseData[0].Profile_Id;
			                //Storing profile info to session storage object
			                $sessionStorage.profileInfo = responseData[0];
			                $scope.working = false;
			                //Routing page based on the roles
                            //Loading Search Page only for SPOC Admin
			                if ($sessionStorage.profileInfo.EmployeeId == 2016 || $sessionStorage.profileInfo.RoleName == "Report Admin")
			                    $location.path("/SearchRoaster");
			                else {
			                    if ($rootScope.isAdmin)
			                        $location.path("/MyRequests");
			                    else
			                        $location.path("/AddRoaster");
			                }
			            }
			            else {
			                errorMessge('Invalid Email Address or Password', 'Invalid Login');
			                $scope.working = false;
			                $scope.reset();
			            }
			        }
			        else {
			            errorMessge('Invalid Email Address or Password', 'Invalid Login');
			            $scope.working = false;
			            $scope.reset();
			        }
			    }, 2000);
			}
			else {
			    $scope.working = false;
			}
		};
        //Clearing all values
		$scope.reset = function() {
			$scope.$broadcast('show-errors-reset');
			$scope.user = { name: '', email: '' };
		};   	
	}]);