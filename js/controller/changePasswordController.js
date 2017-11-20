'use strict';
angular
    .module('changePassCtrl', ['ngStorage', 'ngLoader'])
    .controller('ChangePasswordController', ['$scope', '$rootScope', '$location', '$localStorage', '$sessionStorage', '$timeout', function ($scope, $rootScope, $location, $localStorage, $sessionStorage, $timeout) {

        //Rendering object and controls 
        pageInitialize($scope, $rootScope, $localStorage, 'ChangePassword');
        //Click Event for goback
        $scope.goBack = function () {
            $location.path("/Login");
        };
       //Change Password submit event
        $scope.submit = function () {            
            //Loader
            $scope.working = true;
            //Broad Casting the Validation to the Form
            $scope.$broadcast('show-errors-check-validity');
            if ($scope.changePassForm.$valid) {
                $timeout(function () {                    
                    if (checkEmailExists($scope)) {
                        var responseData = [];
                        var searchProfileData = { "emailAddress": $scope.emailAddress };
                        //Do Ajax post Call
                        responseData = DoAJAXCall("POST", searchProfileService, JSON.stringify(searchProfileData));
                        var status = 1;
                        var createdBy = "User";
                        //Setting Scope Variables
                        $scope.firstName = responseData[0].FirstName;
                        $scope.lastName = responseData[0].LastName;
                        var editprofileData = {
                            "mappingId": responseData[0].Mapping_Id,
                            "profileId": responseData[0].Profile_Id,
                            "teamId": responseData[0].Team_Id,
                            "roleId": responseData[0].Role_Id,
                            "firstName": $scope.firstName,
                            "lastName": $scope.lastName,
                            "emailAddress": $scope.emailAddress,
                            "employeeId": responseData[0].EmployeeId,
                            "contactNumber": responseData[0].ContactNumber,
                            "alternateNumber": responseData[0].AlternateNumber,
                            "address1": responseData[0].Address1,
                            "address2": responseData[0].Address2,
                            "landmark": responseData[0].Landmark,
                            "city": responseData[0].City,
                            "zip": responseData[0].Zip,
                            "country": responseData[0].Country,
                            "createdBy": createdBy,
                            "active": status,
                            "newPassword": $scope.password,
                            "confirmPassword": $scope.confirmPassword
                        };
                        responseData = DoAJAXCall("POST", editProfileService, JSON.stringify(editprofileData));
                        if (responseData != null) {
                            if (responseData[0].Profile_Id != 0) {
                                $scope.working = false;                                
                                sendEmail("ChangePassword", $scope, "Change Password for Lennox Shift Rostering Tool", "email/changePassword.htm");
                                successMessge("Password Updated Succesfully", "Change Password", "#/Login");
                            }
                        }
                    }
                    else {
                        $scope.working = false;
                        errorMessge("Email Address doesn’t exists", "Change Password");
                    }
                }, 2000);
            }
            else {
                $scope.working = false;
            }
        };
    }]);
