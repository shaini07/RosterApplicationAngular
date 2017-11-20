
angular
    .module('myRequestCtrl', ['angularjs-datetime-picker', 'ngStorage', 'ui.bootstrap', 'ngLoader'])
	.controller('MyRequestController', ['$rootScope', '$scope', '$localStorage', '$http', '$filter', '$sessionStorage', '$route', '$timeout', function ($rootScope, $scope, $localStorage, $http, $filter, $sessionStorage, $route, $timeout) {
	    //Checking BrowserSession 
	    if (checkSessionStorage($sessionStorage, $scope, $localStorage, $rootScope)) {
	        pageInitialize($scope, $rootScope, $localStorage, 'MyRequest');
	        var date = new Date();
	        $scope.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
	        $scope.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	        //Loading the loader
	        $scope.working = true;
	        //Loading Shift Names
	        $timeout(function () { loadShifts($scope, $http); $scope.working = false; }, 2000);
	        //Loading the loader
	        $scope.working = true;
	        //Loading Data for auto complete events
	        $timeout(function () { loadAutocompleteList($scope, $http); $scope.working = false; }, 2000);
	        //Loading Data for My request Details
	        $timeout(function () { loadMyRequest($scope, $rootScope, $sessionStorage); $scope.working = false; }, 2000);
	        //Added for bootstrap datetime picker
	        var date = new Date();
	        $scope.dateOptions = {
	            formatYear: 'yy',
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
	        //Search Functionallity
	        $scope.submit = function () {
	            //Loading the loader
	            $scope.working = true;
	            //Loading Roaster search grid	
	            $timeout(function () { loadApprovals($scope, $http, $sessionStorage); $scope.working = false; }, 2000);
	        };
	        //Reset Functionallity
	        $scope.reset = function () {
	            $scope.emailAddress = '';
	            $scope.firstName = '';
	            $scope.lastName = '';
	            $scope.searchForm.Shift = '';
	            var date = new Date();
	            $scope.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
	            $scope.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	            $scope.employeeLst = [];
	            $scope.search();
	        };
	        //Reject Attendance Approval
	        $scope.approveRoster = function (approvalId) {
	            //Loading the loader
	            $scope.working = true;
	            //Loading Roaster search grid	
	            $timeout(function () {
	                approveRosterRequest($scope, approvalId);
	                $scope.working = false;
	            }, 2000);

	        };
	        //Reject Attendance Approval
	        $scope.rejectRoster = function (approvalId) {
	            //Loading the loader
	            $scope.working = true;
	            //Loading Roaster search grid	
	            $timeout(function () {
	                rejectRosterRequest($scope, approvalId);
	                $scope.working = false;
	            }, 2000);

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
            //Loading Status Style
	        $scope.renderStatusStyle = function (status) {
	            var renderStyle = '';
	            switch (status) {
	                case 'Pending':
	                    renderStyle = 'label label-warning';
	                    break;
	                case 'Approved':
	                    renderStyle = 'label label-success';
	                    break;
	                case 'Rejected':
	                    renderStyle = 'label label-danger';
	                    break;
	            }
	            return renderStyle;
	        };
	        //Loading Shift Style
	        $scope.renderShiftStyle = function (employeeShift) {
	            var renderStyle = '';
	            switch (employeeShift) {
	                case 'General Shift':
	                    renderStyle = 'label label-default';
	                    break;
	                case '1st Shift':
	                    renderStyle = 'label label-default';
	                    break;
	                case '2nd Shift':
	                    renderStyle = 'label label-default';
	                    break;
	                case '3rd Shift':
	                    renderStyle = 'label label-default';
	                    break;
	                case '4th Shift':
	                    renderStyle = 'label label-default';
	                    break;
	                case '5th Shift':
	                    renderStyle = 'label label-default';
	                    break;
	                case 'Work From Home':
	                    renderStyle = 'label label-warning';
	                    break;
	                case 'Sick Leave':
	                    renderStyle = 'label label-success';
	                    break;
	                case 'Floating Holiday':
	                    renderStyle = 'label label-success';
	                    break;
	                case 'Casual Leave':
	                    renderStyle = 'label label-primary';
	                    break;
	                case 'Earned Leave':
	                    renderStyle = 'label label-danger';
	                    break;
	                case 'Public Holiday':
	                    renderStyle = 'label label-info';
	                    break;
	                case 'Comp Off':
	                    renderStyle = 'label label-primary';
	                    break;
	                case 'BB Support (12)':
	                    renderStyle = 'label label-default';
	                    break;
	                case 'BB Support (24)':
	                    renderStyle = 'label label-default';
	                    break;
	                case 'Training':
	                    renderStyle = 'label label-primary';
	                    break;
	            }
	            return renderStyle;
	        };
	    }	    
	}]);
//Reject Roster Request
function rejectRosterRequest($scope, approvalId) {    
    var searchRoasterData = { "approvalId": approvalId };
    //Do Ajax post Call
    responseApprovalData = DoAJAXCall("POST", searchRoasterServiceApproval, JSON.stringify(searchRoasterData));
    if (checkRequestRoasterExists(responseApprovalData[0].StartDate, responseApprovalData[0].Profile_Id)) {
        var roasterId = DoAJAXCall("POST", searchRoasterService, JSON.stringify({ "emailAddress": responseApprovalData[0].EmailAddress, "startDate": responseApprovalData[0].StartDate }))[0].Roaster_Id;
        var deleteRoasterData = {
            "roasterId": roasterId
        };
        responseData = DoAJAXCall("POST", deleteRoasterService, JSON.stringify(deleteRoasterData));
    }
    var roasterData = { "approvalId": approvalId, "status": "Rejected" };
    //Do Ajax post Call
    responseData = DoAJAXCall("POST", editRoasterServiceApproval, JSON.stringify(roasterData));
    //Loading Scope Details for loading profile information
    $scope.firstName = responseApprovalData[0].FirstName;
    $scope.lastName = responseApprovalData[0].LastName;
    $scope.employeeId = responseApprovalData[0].FirstName;
    $scope.emailAddress = responseApprovalData[0].EmailAddress;
    $scope.startDate = responseApprovalData[0].StartDate;
    $scope.endDate = responseApprovalData[0].EndDate;
    $scope.ShiftName = responseApprovalData[0].ShiftName;
    $scope.comments = responseApprovalData[0].Comments;
    sendEmail("RejectRequest", $scope, "Updated::Shift Roster modification request for " + $.date($scope.startDate), "email/updatedRequest.htm");
    successMessge("Roster rejected succesfully", "My Pending Approvals", "#/MyRequests");
    $scope.reset();
}
//Approving Roster Request
function approveRosterRequest($scope, approvalId) {
    var searchRoasterData = { "approvalId": approvalId };
    //Do Ajax post Call
    responseApprovalData = DoAJAXCall("POST", searchRoasterServiceApproval, JSON.stringify(searchRoasterData));
    var addRoasterData = {
        "profileId": responseApprovalData[0].Profile_Id,
        "shiftId": responseApprovalData[0].Shift_Id,
        "startDate": responseApprovalData[0].StartDate,
        "endDate": responseApprovalData[0].EndDate,
        "createdBy": "Admin"
    };
    if (!checkRequestRoasterExists(responseApprovalData[0].StartDate, responseApprovalData[0].Profile_Id)) {
        var roasterData = { "approvalId": approvalId, "status": "Approved" };
        var responseApproveData = DoAJAXCall("POST", editRoasterServiceApproval, JSON.stringify(roasterData));
        if (responseApprovalData[0].Comments != "Requested for deletion") {
            responseData = DoAJAXCall("POST", addRoasterService, JSON.stringify(addRoasterData));
            if (responseData != null && responseData != undefined) {
                if (responseData[0].Profile_Id != 0) {
                    //Loading Scope Details for loading profile information
                    $scope.firstName = responseApprovalData[0].FirstName;
                    $scope.lastName = responseApprovalData[0].LastName;
                    $scope.employeeId = responseApprovalData[0].FirstName;
                    $scope.emailAddress = responseApprovalData[0].EmailAddress;
                    $scope.startDate = responseApprovalData[0].StartDate;
                    $scope.endDate = responseApprovalData[0].EndDate;
                    $scope.ShiftName = responseApprovalData[0].ShiftName;
                    $scope.comments = responseApprovalData[0].Comments;
                    sendEmail("ApprovedRequest", $scope, "Updated::Shift Roster modification request for " + $.date($scope.startDate), "email/updatedRequest.htm");
                    successMessge("Roster approved succesfully", "My Pending Approvals", "#/MyRequests");
                    $scope.reset();
                }
            }
        }
        else {
            successMessge("Roster approved succesfully", "My Pending Approvals", "#/MyRequests");
            $scope.reset();
        }
    }
    else {
        $scope.working = false;
        var roasterData = { "approvalId": approvalId, "status": "Rejected" };
        DoAJAXCall("POST", editRoasterServiceApproval, JSON.stringify(roasterData));
        errorMessge("Roster with this date Already Exists", "Add Roster");
        $scope.reset();
    }
}
function checkRequestRoasterExists(startDate, profileId) {
    var roasterExistsData = { "startDate": startDate, "profileId": profileId };
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
//Load Roaster Service
function loadApprovals($scope, $http, $sessionStorage) {    
    //Construct the JSON Object      
    var managerId = ($sessionStorage.profileInfo.EmployeeId != 2016 && !$scope.notAdmin) ? $sessionStorage.profileInfo.EmployeeId : '';
    var shiftId = ($scope.searchForm.Shift != undefined) ? $scope.searchForm.Shift.Shift_Id : 0;
    var startDate = ($scope.startDate != undefined && $scope.startDate != "") ? $.date($scope.startDate) : $scope.startDate;
    var endDate = ($scope.endDate != undefined && $scope.endDate != "") ? $.date($scope.endDate) : $scope.endDate;
    var searchRoasterData = { "emailAddress": $scope.emailAddress, "firstName": $scope.firstName, "lastName": $scope.lastName, "shiftId": shiftId, "startDate": startDate, "endDate": endDate, "managerId": managerId.toString() };
    //Do Ajax post Call
    responseData = DoAJAXCall("POST", searchRoasterServiceApproval, JSON.stringify(searchRoasterData));
    $scope.employeeLst = [];
    $scope.showRoasterGrid = true;
    if (responseData != undefined) {
        if (responseData.length > 0) {
            $scope.employeeLst = responseData;
        }
    }
    $scope.search();
}
function loadMyRequest($scope, $rootScope, $sessionStorage) {
    if ($scope.notAdmin) {
        $scope.firstName = $sessionStorage.profileInfo.FirstName;
        $scope.lastName = $sessionStorage.profileInfo.LastName;
        $scope.emailAddress = $sessionStorage.profileInfo.EmailAddress;
    }
    else {
        $scope.firstName = '';
        $scope.lastName = '';
        $scope.emailAddress = '';
    }
}