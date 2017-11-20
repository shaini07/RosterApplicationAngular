'use strict';
angular
    .module('searchProfileCtrl', ['angularjs-datetime-picker', 'ngStorage', 'ngLoader'])
	.controller('SearchProfileController', ['$rootScope', '$scope', '$localStorage', '$http', '$filter', '$route', '$sessionStorage', '$timeout', function ($rootScope, $scope, $localStorage, $http, $filter, $route, $sessionStorage, $timeout) {
	    //Checking BrowserSession 
	    if (checkSessionStorage($sessionStorage, $scope, $localStorage, $rootScope)) {
	        pageInitialize($scope, $rootScope, $localStorage, 'SearchUser');
	        //Loading the loader
	        $scope.working = true;
	        //Loading Team Names	   
	        $timeout(function () { loadTeams($scope, $http); $scope.working = false; }, 2000);
	        //Loading the loader
	        $scope.working = true;
	        //Loading Data for auto complete events
	        $timeout(function () { loadAutocompleteList($scope, $http); $scope.working = false; }, 2000);
	        //Added for Paging
	        var searchMatch = function (haystack, needle) {
	            if (!needle) {
	                return true;
	            }
	            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
	        };
	        // initializing the filtered items
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
	        // calculate pages in place
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
	        //Delete Profile
	        $scope.deleteUser = function (employeeId, mappingId) {
	            //Loading the loader
	            $scope.working = true;
	            $timeout(function () { deleteProfile(employeeId, mappingId, $route); $scope.working = false; }, 2000);
	        };
	        //Search Profile Users
	        $scope.submit = function () {
	            //Loading the loader
	            $scope.working = true;
	            //Loading Employee search grid	   
	            $timeout(function () { loadProfile($scope, $http); $scope.working = false; }, 2000);
	        };
	    }

	}]);
//Delete Profile
function deleteProfile(employeeId, mappingId, $route) {
    $.Zebra_Dialog('Do you want to delete this profile ', {
        'type': 'question',
        'title': 'Delete Profile',
        'buttons': ['Yes', 'No'],
        'onClose': function (caption) {
            if (caption == "Yes") {
                var deleteProfileData = {
                    "profileId": employeeId,
                    "mappingId": mappingId
                };
                responseData = DoAJAXCall("POST", deleteProfileService, JSON.stringify(deleteProfileData));
                if (responseData != null) {
                    if (responseData.length == 0) {
                        successMessge('Attendance record deleted succesfully', 'Delete Profile', '#/SearchProfile');
                        $route.reload();
                    }
                }
            }
        }
    });
}

function loadProfile($scope, $http) {    
    //Construct the JSON Object       
    var managerName = ($scope.searchProfile.TeamManager != undefined) ? $scope.searchProfile.TeamManager.TeamManagerName : '';
    var teamId = ($scope.searchProfile.Team != undefined) ? $scope.searchProfile.Team.Team_Id : 0;
    var searchProfileData = { "emailAddress": $scope.searchProfile.emailAddress, "firstName": $scope.searchProfile.firstName, "lastName": $scope.searchProfile.lastName, "employeeId": $scope.searchProfile.employeeId, "managerName": managerName, "teamId": teamId };
    //Do Ajax post Call
    responseData = DoAJAXCall("POST", searchProfileService, JSON.stringify(searchProfileData));
    $scope.showGrid = true;
    $scope.employeeLst = [];
    if (responseData != undefined) {
        if (responseData.length > 0) {
            $scope.employeeLst = responseData;            
        }
    }
    $scope.search();
}
