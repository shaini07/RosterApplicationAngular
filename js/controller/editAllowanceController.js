'use strict';
angular
    .module('editAllowanceCtrl', ['angularjs-datetime-picker', 'ngStorage', 'ngLoader'])
.controller('EditAllowanceController', ['$rootScope', '$scope', '$localStorage', '$routeParams', '$http', '$sessionStorage', '$timeout', function ($rootScope, $scope, $localStorage, $routeParams, $http, $sessionStorage, $timeout) {
    //Checking BrowserSession 
    if (checkSessionStorage($sessionStorage, $scope, $localStorage, $rootScope)) {
        pageInitialize($scope, $rootScope, $localStorage, 'EditAllowance');
        //Loading the loader
        $scope.working = true;
        //Loading Shift Names
        $timeout(function () { loadShifts($scope, $http); $scope.working = false; }, 2000);
        //Loading the loader
        $scope.working = true;
        //Load Roaster by Id
        $timeout(function () { loadRoasterbyId($scope, $routeParams); $scope.working = false; }, 2000);
        //Enabling the RosterCutoffOption
        $timeout(function () { renderCutoffDate($scope); $scope.working = false; }, 2000);

        //Added for bootstrap datetime picker
        var date = new Date();
        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2200, 5, 22),
            minDate: new Date(date.getFullYear(), date.getMonth(), 1),
            startingDay: 1
        };
        //Setting date format
        $scope.format = 'MM-dd-yyyy';
        //Loading Start Date Control
        $scope.openStartDateControl = function () {
            $timeout(function () {
                $scope.startOpened = true;
            });
        };
        //Loading End Date Control
        $scope.openEndDateControl = function () {
            $timeout(function () {
                $scope.endOpened = true;
            });
        };
        //Loaded for Validating Date comparison
        $scope.$watch('startDate', function (newval, oldval) {
            if ($scope.endDate < $scope.startDate) {
                $scope.endDate = '';
            };
        });
        //Loaded for Validating Date comparison
        $scope.$watch('endDate', function (newval, oldval) {
            if ($scope.endDate < $scope.startDate) {
                $scope.endDate = '';
            };
        });
        $scope.editAllowance = function () {
            //Loading the loader
            $scope.working = true;
            $scope.$broadcast('show-errors-check-validity');
            if ($scope.editAttendanceForm.$valid) {
                $timeout(function () {
                    var createdBy = "Admin";
                    var editRoasterData = {
                        "roasterId": $scope.roasterId,
                        "profileId": $scope.profileId,
                        "shiftId": $scope.shift.Shift_Id,
                        "startDate": $.date($scope.startDate),
                        "endDate": $.date($scope.endDate),
                        "createdBy": createdBy
                    };
                    responseData = DoAJAXCall("POST", editRoasterService, JSON.stringify(editRoasterData));
                    if (responseData != null && responseData != undefined) {
                        if (responseData[0].Profile_Id != 0) {
                            $scope.startDate = '';
                            $scope.endDate = '';
                            $scope.shift.Shift_Id = '';
                            $scope.working = false;
                            var redirectionUrl = '';
                            redirectionUrl = ($rootScope.notAdmin) ? "#/MyAllowance" : "#/SearchAllowance";
                            successMessge("Allowance updated succesfully", "Edit Allowance", redirectionUrl);
                        }
                    }
                }, 2000);
            }
            else {
                $scope.working = false;
            }
        };
    }
}]);

function loadRoasterbyId($scope, $routeParams) {
    var roasterData = { "roasterId": $routeParams.roasterId };
    //Do Ajax post Call
    responseData = DoAJAXCall("POST", searchRoasterService, JSON.stringify(roasterData));
    $scope.roasterId = $routeParams.roasterId;
    $scope.employeeId = responseData[0].EmployeeId;
    $scope.firstName = responseData[0].FirstName;
    $scope.lastName = responseData[0].LastName;
    $scope.profileId = responseData[0].Profile_Id;
    $scope.emailAddress = responseData[0].EmailAddress;
    $scope.startDate = new Date(responseData[0].StartDate);
    $scope.endDate = new Date(responseData[0].EndDate);
    $scope.shift = { "Shift_Id": responseData[0].Shift_Id, "ShiftName": responseData[0].ShiftName };
    //Loading scope variables for history details
    $scope.oldStartDate = responseData[0].StartDate;
    $scope.oldEndDate = responseData[0].EndDate;
    $scope.oldShiftName = responseData[0].ShiftName;
}
