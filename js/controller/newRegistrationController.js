'use strict';
angular
    .module('newRegCntrl', ['ngStorage', 'ngLoader'])
    .controller('NewRegistrationController', ['$rootScope', '$scope', '$localStorage', '$http', '$sessionStorage', '$timeout', '$location', function ($rootScope, $scope, $localStorage, $http, $sessionStorage, $timeout, $location) {        
        pageInitialize($scope, $rootScope, $localStorage, 'NewRegistration');
        //Click Event for goback
        $scope.goBack = function () {
            $location.path("/Login");
        };
        //Loading the loader
        $scope.working = true;
        //Loading Team Names
        $timeout(function () { loadTeams($scope, $http); $scope.working = false; }, 2000);
        //Loading the loader
        $scope.working = true;
        //Loading Roles
        $timeout(function () { loadRoles($scope, $http); $scope.working = false; }, 2000);
        //Setting Default Country
        $scope.country = "India";
        $scope.submit = function () {            
            $scope.$broadcast('show-errors-check-validity');
            if ($scope.addUserForm.$valid) {
                //Loading the loader
                $scope.working = true;
                $timeout(function () {
                    var status = 1;
                    var createdBy = "Admin";
                    var addProfileData = {
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
                        "newPassword": $scope.password,
                        "confirmPassword": $scope.confirmPassword
                    };
                    if (!checkEmailExists($scope)) {
                        responseData = DoAJAXCall("POST", addProfileService, JSON.stringify(addProfileData));
                        if (responseData != null) {
                            if (responseData[0].Profile_Id != 0) {
                                sendEmail("NewRegistration", $scope, "Welcome to Lennox Shift Rostering Tool", "email/newRegister.htm");
                                $scope.working = false;
                                successMessge("Registration Completed Succesfully", "New Registration", "#/Login");
                                $scope.reset();
                            }
                        }
                    }
                    else {
                        $scope.working = false;
                        errorMessge("Email Id Already Exists", "New Registration");
                    }
                }, 2000);
            }
        };
        //Resetting the scope variables
        $scope.reset = function () {
            $scope.firstName = '';
            $scope.lastName = '';
            $scope.employeeId = '';
            $scope.emailAddress = '';
            $scope.contactNumber = '';
            $scope.altContactNumber = '';
            $scope.password = '';
            $scope.confirmPassword = '';
            $scope.address1 = '';
            $scope.address2 = '';
            $scope.landmark = '';
            $scope.city = '';
            $scope.zip = '';
            $scope.manager = '';
            $scope.roleInfo = '';
            $scope.team = '';
        }

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
    }]);