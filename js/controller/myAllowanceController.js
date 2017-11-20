
angular
    .module('myAllowanceCtrl', ['angularjs-datetime-picker', 'ngStorage', 'ui.bootstrap', 'ngLoader'])
	.controller('MyAllowanceController', ['$rootScope', '$scope', '$localStorage', '$http', '$filter', '$sessionStorage', '$route', '$timeout', function ($rootScope, $scope, $localStorage, $http, $filter, $sessionStorage, $route, $timeout) {
	    //Checking BrowserSession 	    
	    if (checkSessionStorage($sessionStorage, $scope, $localStorage, $rootScope)) {
	        //Loading Current Month Start Date and End Date by Default
	        var date = new Date();
	        $scope.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
	        $scope.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	        pageInitialize($scope, $rootScope, $localStorage, 'MyRoster');
	        //Loading the loader
	        $scope.working = true;
	        //Load Profile Employee
	        $timeout(function () { loadAllowanceProfile($scope, $rootScope, $sessionStorage); $scope.working = false; }, 2000);
	        //Loading Shift Names
	        $timeout(function () { loadShifts($scope, $http); $scope.working = false; }, 2000);
	        //Loading the loader
	        $scope.working = true;
	        //Loading Data for auto complete events
	        $timeout(function () { loadAutocompleteList($scope, $http); $scope.working = false; }, 2000);
	        //Enabling the RosterCutoffOption
	        $timeout(function () { renderCutoffDate($scope); $scope.working = false; }, 2000);
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
	            $timeout(function () { loadMyAllowance($scope, $http); $scope.working = false; }, 2000);
	        };
	        //Reset Functionallity
	        $scope.reset = function () {	           
	            $scope.searchForm.Shift = '';
	            var date = new Date();
	            $scope.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
	            $scope.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	            $scope.employeeLst = [];
	            $scope.search();
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

//Load Roaster Service
function loadMyAllowance($scope, $http) {    
    //Construct the JSON Object      
    var shiftId = ($scope.searchForm.Shift != undefined) ? $scope.searchForm.Shift.Shift_Id : 0;
    var startDate = ($scope.startDate != undefined && $scope.startDate != "") ? $.date($scope.startDate) : $scope.startDate;
    var endDate = ($scope.endDate != undefined && $scope.endDate != "") ? $.date($scope.endDate) : $scope.endDate;
    var searchRoasterData = { "emailAddress": $scope.emailAddress, "firstName": $scope.firstName, "lastName": $scope.lastName, "shiftId": shiftId, "startDate": startDate, "endDate": endDate };
    //Do Ajax post Call
    responseData = DoAJAXCall("POST", searchRoasterService, JSON.stringify(searchRoasterData));
    $scope.employeeLst = [];
    $scope.showRoasterGrid = true;
    if (responseData != undefined) {
        if (responseData.length > 0) {
            $scope.employeeLst = responseData;
        }
    }
    $scope.search();
}
//Loading Profile details 
function loadAllowanceProfile($scope, $rootScope, $sessionStorage) {
    $scope.firstName = $sessionStorage.profileInfo.FirstName;
    $scope.lastName = $sessionStorage.profileInfo.LastName;
    $scope.emailAddress = $sessionStorage.profileInfo.EmailAddress;
    $scope.employeeId = $sessionStorage.profileInfo.EmployeeId;
    $scope.profileId = $sessionStorage.profileInfo.Profile_Id;    
}