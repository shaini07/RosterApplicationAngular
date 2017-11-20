'use strict';
angular
    .module('addAllowanceCtrl', ['angularjs-datetime-picker', 'ngStorage', 'ngLoader'])
	.controller('AddAllowanceController', ['$rootScope', '$scope', '$localStorage', '$http', '$filter', '$sessionStorage', '$timeout', function ($rootScope, $scope, $localStorage, $http, $filter, $sessionStorage, $timeout) {
	    //Checking BrowserSession 
	    if (checkSessionStorage($sessionStorage, $scope, $localStorage, $rootScope)) {
	        pageInitialize($scope, $rootScope, $localStorage, 'AddAllowance');
	        //rendering Calendar Control
	        renderCalendarControl();
	        //Loading the loader
	        $scope.working = true;
	        //Load Profile Employee
	        $timeout(function () { loadRoasterProfile($scope, $rootScope, $sessionStorage); $scope.working = false; }, 2000);
	        //Loading the loader
	        $scope.working = true;
	        //Loading Elements based on the Switch Event  
	        $timeout(function () { triggerSwitchEvent($scope); $scope.working = false; }, 2000);
	        //Loading the loader
	        $scope.working = true;
	        //Loading Shift Names
	        $timeout(function () { loadShifts($scope, $http); $scope.working = false; }, 2000);
	        //Loading the loader
	        $scope.working = true;
	        //Loading Team Names
	        $timeout(function () { loadTeams($scope, $http); $scope.working = false; }, 2000);
	        //Loading the loader
	        $scope.working = true;
	        //Loading Data for auto complete events
	        $timeout(function () { loadAutocompleteList($scope, $http); $scope.working = false; }, 2000);

	        //Attendance Button Click Event
	        $scope.addAttendance = function () {
	            $scope.$broadcast('show-errors-check-validity');
	            if ($scope.addAllowanceForm.$valid) {
	                //Loading the loader
	                $scope.working = true;
	                addAllowance($scope, $timeout);
	            }
	        };
	        //Loading profile details based on the employee Id
	        $scope.loadProfileDetails = function () {
	            //Loading the loader
	            $scope.working = true;
	            $timeout(function () {
	                loadProfileDetails($scope); $scope.working = false;
	            }, 2000);
	        };
	        //saving dates for offline
	        $scope.saveEvent = function () {
	            var event = {
	                id: $('#event-modal input[name="event-index"]').val(),
	                shiftId: $scope.shiftPopup.Shift_Id,
	                name: $scope.shiftPopup.ShiftName,
	                startDate: convertJSDate($('#event-modal input[name="event-start-date"]').val()),
	                endDate: convertJSDate($('#event-modal input[name="event-end-date"]').val())
	            }
	            var dataSource = $('#calendar').data('calendar').getDataSource();
	            event = (event.id == "") ? getEventDetails(event) : event;
	            var calStartDate = $.date(event.startDate);
	            var calEndDate = $.date(event.endDate);
	            if (event.id) {
	                for (var i in dataSource) {	                    
	                    if (dataSource[i].id == event.id) {
	                        dataSource[i].shiftId = event.shiftId;
	                        dataSource[i].name = event.name;
	                        dataSource[i].startDate = convertJSDate(calStartDate);
	                        dataSource[i].endDate = convertJSDate(calStartDate);
	                        if (convertJSDate(calStartDate) != convertJSDate(calEndDate)) {
	                            event.id = getEventId(dataSource, convertJSDate(calEndDate));
	                            calStartDate = $.date(new Date(convertJSDate(calStartDate).getFullYear(), convertJSDate(calStartDate).getMonth(), convertJSDate(calStartDate).getDate() + 1));
	                            alert(calStartDate);
	                        }
	                    }
	                }
	            }
	            else {
	                var newId = 0;
	                var start = event.startDate;
	                var end = event.endDate;
	                for (var i in dataSource) {
	                    if (dataSource[i].id > newId) {
	                        newId = dataSource[i].id;
	                    }
	                }
	                while (start <= end) {
	                    var updatedDate = $.date(start);
	                    newId++;
	                    var event = {
	                        id: newId,
	                        shiftId: $scope.shiftPopup.Shift_Id,
	                        name: $scope.shiftPopup.ShiftName,
	                        startDate: convertToDate(updatedDate),
	                        endDate: convertToDate(updatedDate)
	                    }
	                    dataSource.push(event);
	                    start = new Date(start.setDate(start.getDate() + 1));
	                }
	            }
	            $('#calendar').data('calendar').setDataSource(dataSource);
	            $('#event-modal').modal('hide');
	        };
	    }

	}]);
function getEventId(dataSource, endDate) {
    var eventId = '';
    for (var i in dataSource) {
        if ($.date(dataSource[i].endDate) == $.date(endDate)) {
            eventId = dataSource[i].id;
            break;
        }
    }
    return eventId;
}
//Add Calendar View Roaster
function addAllowance($scope, $timeout) {
    $("#dateControl").hide();
    var dataSource = $('#calendar').data('calendar').getDataSource();
    //Loading the loader
    $scope.working = true;
    var success = false;
    var roasterData = {};
    var day = '';
    $timeout(function () {
        for (var i in dataSource) {
            $scope.startDate = $.date(dataSource[i].startDate);
            $scope.endDate = $.date(dataSource[i].endDate);
            var createdBy = "Admin";
            roasterData = {
                "profileId": $scope.profileId,
                "shiftId": dataSource[i].shiftId,
                "startDate": $scope.startDate,
                "endDate": $scope.endDate,
                "createdBy": createdBy
            };
            if (!checkAllowanceExists($scope)) {
                success = insertAllowance($scope, $.date(dataSource[i].startDate), roasterData);
                sendEmail("NewRoster", $scope, "Shift Allowance for " + $.date($scope.startDate), "email/newRoster.htm");
            }
            else {
                $scope.working = false;
                errorMessge("Allowance with this date Already Exists", "Add Allowance");
                break;
            }
        }
        if (success) {
            $scope.working = false;
            sendEmail("NewRoster", $scope, "Shift Allowance for " + $.date($scope.startDate), "email/newRoster.htm");
            $scope.shift.Shift_Id = '';
            successMessge("Shift Allowance Added Succesfully", "Add Allowance", "#/AddAllowance");
        }
        else {
            $scope.working = false;
            errorMessge("Error in adding Shift Allowance", "Add Allowance");
        }

    }, 2000);
}
function insertAllowance($scope, startDate, roasterData) {
    var success = false;
    $scope.startDate = startDate;
    if (!checkRoasterExists($scope)) {
        responseData = DoAJAXCall("POST", addRoasterService, JSON.stringify(roasterData));
        if (responseData != null && responseData != undefined) {
            if (responseData[0].Profile_Id != 0)
                success = true;
            else
                success = false;
        }
        else {
            success = false;
        }
    }
    else {
        success = false;
    }
    return success;
}
function checkAllowanceExists($scope) {
    var roasterExistsData = { "startDate": $scope.startDate, "profileId": $scope.profileId };
    responseData = DoAJAXCall("POST", checkRoasterExistService, JSON.stringify(roasterExistsData));
    if (responseData != null) {
        if (responseData.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}
//Loading Add Profile details 
function loadRoasterProfile($scope, $rootScope, $sessionStorage) {
    if (!$rootScope.isAdmin && $rootScope.isAdmin != undefined) {
        $scope.firstName = $sessionStorage.profileInfo.FirstName;
        $scope.lastName = $sessionStorage.profileInfo.LastName;
        $scope.emailAddress = $sessionStorage.profileInfo.EmailAddress;
        $scope.employeeId = $sessionStorage.profileInfo.EmployeeId;
        $scope.profileId = $sessionStorage.profileInfo.Profile_Id;
        $rootScope.isAdmin = false;
    }
    else {
        $rootScope.isAdmin = true;
        $scope.firstName = '';
        $scope.lastName = '';
        $scope.emailAddress = '';
        $scope.employeeId = '';
    }
}
//Load Employee Profile by team Id
function loadEmployeeProfile($scope, $http) {
    var teamId = ($scope.addAttendance.Teams != undefined) ? $scope.addAttendance.Teams.Team_Id : 0;
    var searchProfileData = { "emailAddress": "", "firstName": "", "lastName": "", "employeeId": 0, "managerName": "", "teamId": teamId };
    //Do Ajax post Call
    responseData = DoAJAXCall("POST", searchProfileService, JSON.stringify(searchProfileData));
    $scope.displaySearch = true;
    $scope.employeeLst = responseData;
    $scope.search();
}
//Load reporting manager info for team 
function loadReportingManager($scope, $http) {
    var teamId = ($scope.addAttendance.Teams != undefined) ? $scope.addAttendance.Teams.Team_Id : 0;
    var searchProfileData = { "teamId": teamId };
    //Do Ajax post Call
    responseData = DoAJAXCall("POST", reportingManagerService, JSON.stringify(searchProfileData));
    $scope.showReportingMgr = true;
    if (responseData != undefined) {
        if (responseData.length > 0) {
            $scope.ReportingMgr = responseData[0].TeamManagerName;
        }
    }
}
//Load Profile details  for employee Id on text change event
function loadProfileDetails($scope) {
    var profileData = { "employeeId": $scope.employeeId };
    //Do Ajax post Call
    responseData = DoAJAXCall("POST", searchProfileService, JSON.stringify(profileData));
    if (responseData != undefined) {
        if (responseData.length > 0) {
            $scope.firstName = responseData[0].FirstName;
            $scope.lastName = responseData[0].LastName;
            $scope.emailAddress = responseData[0].EmailAddress;
            $scope.profileId = responseData[0].Profile_Id;
        }
        else {
            $scope.firstName = '';
            $scope.lastName = '';
            $scope.emailAddress = '';
            $scope.profileId = '';
        }
    }
}
