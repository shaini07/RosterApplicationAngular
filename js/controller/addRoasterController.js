'use strict';
angular
    .module('addRoasterCtrl', ['angularjs-datetime-picker', 'ngStorage', 'ngLoader'])
	.controller('AddRoasterController', ['$rootScope', '$scope', '$localStorage', '$http', '$filter', '$sessionStorage', '$timeout', function ($rootScope, $scope, $localStorage, $http, $filter, $sessionStorage, $timeout) {
	    //Checking BrowserSession 
	    if (checkSessionStorage($sessionStorage, $scope, $localStorage, $rootScope)) {
	        pageInitialize($scope, $rootScope, $localStorage, 'AddAttendance');
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
	        //Added for Paging
	        var searchMatch = function (haystack, needle) {
	            if (!needle) {
	                return true;
	            }
	            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
	        };
	        // init the filtered items
	        $scope.search = function () {
	            $scope.filteredItems = $filter('filter')($scope.employeeLst, function (employee) {
	                for (var attr in employee) {
	                    if (searchMatch(employee[attr], $scope.query))
	                        return true;
	                }
	                return false;
	            });
	            $scope.currentPage = 0;
	            // now group by pages
	            $scope.groupToPages();
	        };
	        // calculate page in place
	        $scope.groupToPages = function () {
	            $scope.pagedItems = [];
	            for (var i = 0; i < $scope.filteredItems.length; i++) {
	                if (i % $scope.itemsPerPage === 0) {
	                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.filteredItems[i]];
	                } else {
	                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
	                }
	            }
	        };
	        $scope.range = function (size, start, end) {
	            var ret = [];
	            if (size < end) {
	                end = size;
	                if (size < $scope.gap) {
	                    start = 0;
	                } else {
	                    start = size - $scope.gap;
	                }
	            }
	            for (var i = start; i < end; i++) {
	                ret.push(i);
	            }
	            return ret;
	        };
	        $scope.prevPage = function () {
	            if ($scope.currentPage > 0) {
	                $scope.currentPage--;
	            }
	        };
	        $scope.nextPage = function () {
	            if ($scope.currentPage < $scope.pagedItems.length - 1) {
	                $scope.currentPage++;
	            }
	        };
	        $scope.setPage = function () {
	            $scope.currentPage = this.n;
	        };
	        //Attendance Button Click Event
	        $scope.addAttendance = function () {	            
	            $scope.$broadcast('show-errors-check-validity');
	            if ($scope.addAttendanceForm.$valid) {
	                //Loading the loader
	                $scope.working = true;
	                $timeout(function () {
	                    var createdBy = "Admin";
	                    var addRoasterData = {
	                        "profileId": $scope.profileId,
	                        "shiftId": $scope.shift.Shift_Id,
	                        "startDate": $.date($scope.startDate),
	                        "endDate": $.date($scope.endDate),
	                        "createdBy": createdBy
	                    };
	                    if (!checkRoasterExists($scope)) {
	                        responseData = DoAJAXCall("POST", addRoasterService, JSON.stringify(addRoasterData));
	                        if (responseData != null && responseData != undefined) {
	                            if (responseData[0].Profile_Id != 0) {
	                                $scope.working = false;
	                                sendEmail("NewRoster", $scope, "Shift Roster for " + $.date($scope.startDate), "email/newRoster.htm");
	                                $scope.startDate = '';
	                                $scope.endDate = '';
	                                $scope.shift.Shift_Id = '';
	                                successMessge("Roster Added Succesfully", "Add Roster", "#/AddRoaster");
	                            }
	                        }
	                    }
	                    else {
	                        $scope.working = false;
	                        errorMessge("Roster with this date Already Exists", "Add Roster");
	                    }
	                }, 2000);
	            }
	        };
	        //Bulk Attendance Button Click Event
	        $scope.addBulkAttendance = function () {
	            $scope.$broadcast('show-errors-check-validity');
	            if ($scope.addAttendanceForm.$valid) {
	                //Loading the loader
	                $scope.working = true;
	                $timeout(function () {
	                    if (validateControls($scope)) {
	                        addbulkInsertRoaster($scope);
	                    }
	                    $scope.working = false;
	                }, 2000);
	            }
	        };
	        $scope.$watch('addAttendance.Teams', function (newVal, oldVal) {
	            if ($scope.addAttendance.Teams) {
	                //Loading the loader
	                $scope.working = true;
	                $timeout(function () {
	                    //Loading Bulk Employee search grid
	                    loadEmployeeProfile($scope, $http); $scope.working = false;
	                }, 2000);
	                $timeout(function () {
	                    //Loading Reporting Manager
	                    loadReportingManager($scope, $http); $scope.working = false;
	                }, 2000);
	            }
	        });
	        //Loading profile details based on the employee Id
	        $scope.loadProfileDetails = function () {
	            //Loading the loader
	            $scope.working = true;
	            $timeout(function () {
	                loadProfileDetails($scope); $scope.working = false;
	            }, 2000);
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
	    }

	}]);
function checkRoasterExists($scope) {    
    var roasterExistsData = { "startDate": $.date($scope.startDate), "profileId": $scope.profileId };
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
function triggerSwitchEvent($scope) {
    $('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function (event, state) {
        if (!state) {
            $("#singleEntry").show();
            $("#bulkEntry").hide();
            $scope.validateBulkLst = false;
        }
        else {
            $("#singleEntry").hide();
            $("#bulkEntry").show();
            $scope.validateBulkLst = true;
        }
    });
}

//Added for Bulk Roaster Insert
function addbulkInsertRoaster($scope) {
    var successCompletion = false;    
    if ($scope.employeeLst != null && $scope.employeeLst != undefined && $scope.employeeLst.length > 0) {
        var profileLst = ($scope.employeeLst.length > 0) ? $scope.employeeLst : [$scope.employeeLst[0]];
        $.each(profileLst, function (obj, value) {
            var checkList = $("#chkBox_" + value.EmployeeId).is(':checked');
            $scope.startDate = $("#fromDt_" + value.EmployeeId).val();
            $scope.profileId = value.Profile_Id;
            if (checkList) {
                var e = document.getElementById("drpShf_" + value.EmployeeId);
                var shiftId = e.options[e.selectedIndex].value;
                var createdBy = "Admin";
                var addRoasterData = {
                    "profileId": value.Profile_Id,
                    "shiftId": shiftId,
                    "startDate": $("#fromDt_" + value.EmployeeId).val(),
                    "endDate": $("#toDt_" + value.EmployeeId).val(),
                    "createdBy": createdBy
                };
                if (!checkRoasterExists($scope)) {
                    responseData = DoAJAXCall("POST", addRoasterService, JSON.stringify(addRoasterData));
                    if (responseData == null && responseData == undefined) {
                        successCompletion = false;
                        errorMessge("Unable to add roster for the employee " + value.EmployeeId, "Add Roster");
                    }
                    else {
                        successCompletion = true;
                    }
                }
                else {
                    successCompletion = false;
                    errorMessge("Roster with this date already exists for the employee " + value.EmployeeId, "Add Roster");
                    return successCompletion;
                }
            }
        });
        if (successCompletion) {
            successMessge("Roster Added Succesfully", "Add Roster", "#/SearchRoaster");
        }
    }
}
//Loading and Validating Controls
function validateControls($scope) {
    var valid = true;    
    if ($scope.employeeLst != null && $scope.employeeLst != undefined && $scope.employeeLst.length > 0) {
        var profileLst = ($scope.employeeLst.length > 0) ? $scope.employeeLst : [$scope.employeeLst[0]];
        $.each(profileLst, function (obj, value) {
            var checkList = $("#chkBox_" + value.EmployeeId).is(':checked');
            var e = document.getElementById("drpShf_" + value.EmployeeId);
            var shiftId = e.options[e.selectedIndex].value;
            if (checkList) {
                if ($('#fromDt_' + value.EmployeeId).val() == '') {
                    valid = false;
                    errorMessge("Please enter 'From Date' for employee id " + value.EmployeeId, "Add Roster");
                    return valid;
                }
                if ($('#toDt_' + value.EmployeeId).val() == '') {
                    valid = false;
                    errorMessge("Please enter 'To Date' for employee id " + value.EmployeeId, "Add Roster");
                    return valid;
                }
                if ($('#toDt_' + value.EmployeeId).val() < $('#fromDt_' + value.EmployeeId).val()) {
                    valid = false;
                    $('#toDt_' + value.EmployeeId).val = '';
                    errorMessge("Please enter 'To Date' greater than 'Start Date' for employee id " + value.EmployeeId, "Add Roster");
                    return valid;
                }
                if (shiftId == 0) {
                    valid = false;
                    errorMessge("Please select a 'Shift' for employee id " + value.EmployeeId, "Add Roster");
                    return valid;
                }
            }
        });
    }
    else {
        valid = false;
        return valid;
    }
    return valid;

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
