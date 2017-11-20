//Loading Common Urls
var serviceUrl = "http://localhost:1337/";
var loadTmMgnrService = serviceUrl + "LoadTeamManager";
var loadShftService = serviceUrl + "LoadShifts";
var loadRolesService = serviceUrl + "LoadRoles";
var loginService = serviceUrl + "ValidateLogin";
var addProfileService = serviceUrl + "AddProfile";
var checkEmailExistService = serviceUrl + "CheckEmailExists";
var editProfileService = serviceUrl + "EditProfile";
var profileByIdService = serviceUrl + "LoadProfilebyId";
var deleteProfileService = serviceUrl + "DeleteProfile";
var searchProfileService = serviceUrl + "SearchProfile";
var reportingManagerService = serviceUrl + "ReportingManager";
var autocompleteService = serviceUrl + "AutoCompleteService";
var searchRoasterService = serviceUrl + "SearchRoaster";
var deleteRoasterService = serviceUrl + "DeleteShiftRoaster";
var checkRoasterExistService = serviceUrl + "CheckRosterExists";
var addRoasterService = serviceUrl + "AddShiftRoaster";
var editRoasterService = serviceUrl + "EditShiftRoaster";
var searchRoasterServiceApproval = serviceUrl + "SearchRoasterApproval";
var addRoasterServiceApproval = serviceUrl + "AddShiftRoasterApproval";
var editRoasterServiceApproval = serviceUrl + "EditShiftRoasterApproval";
var sendEmailService = serviceUrl + "SendEmail";
var sendEmailFlag = true;

//Loading Common Drop Downs
function loadTeams($scope, $http) {   
    //Do Ajax post Call
    responseData = DoAJAXCall("GET", loadTmMgnrService, JSON.stringify('{}'));
    $scope.teamLst = responseData;  
}
function loadShifts($scope, $http) {   
    //Do Ajax post Call
    responseData = DoAJAXCall("GET", loadShftService, JSON.stringify('{}'));
    $scope.shiftLst = responseData;    
}
function loadRoles($scope, $http) {    
    //Do Ajax post Call
    responseData = DoAJAXCall("GET", loadRolesService, JSON.stringify('{}'));
    $scope.roleLst = responseData;
}
//Loading Common Service for auto complete list
function loadAutocompleteList($scope, $http) {
    //Do Ajax post Call
    responseData = DoAJAXCall("POST", autocompleteService, '');
    $scope.searchLst = [];
    $scope.searchLst = responseData;
}
//Loading Common Success Message tempelate function
function successMessge(message, title,redirectionUrl) {
    $.Zebra_Dialog(message, {
        'type': 'confirmation',
        'title': title,
        'onClose': function (caption) {
            if (caption == "Ok")
                window.location = redirectionUrl;
                
        }
    });
}
//Loading Common Error Message tempelate function
function errorMessge(message, title) {
    $.Zebra_Dialog(message, {
        'type': 'error',
        'title': title
    });
}
//Initializing the page control
function pageInitialize($scope, $rootScope, $localStorage, controllerType) {    
    switch (controllerType) {
        case 'Login':           
            $localStorage.$reset();
            $rootScope.loggedIn = false;
            $rootScope.isAdmin = false;
            $rootScope.isReportAdmin = false;
            $rootScope.pageTitle = 'Lennox Shift Rostering Tool :: Login';
            break;
        case 'ChangePassword':
            $localStorage.$reset();
            $rootScope.loggedIn = false;
            $rootScope.isAdmin = false;
            $rootScope.isReportAdmin = false;
            $rootScope.pageTitle = 'Lennox Shift Rostering Tool :: ChangePassword';
            break;
        case 'NewRegistration':
            $rootScope.loggedIn = false;
            $rootScope.isAdmin = false;
            $rootScope.isReportAdmin = false;
            $rootScope.pageTitle = 'Lennox Shift Rostering Tool :: New Registration';
            disableKeyPressEvent('#employeeId');
            disableKeyPressEvent('#contactNumber');            
            disableKeyPressEvent('#zipCode');
            break;
        case 'Home':            
            $scope.gap = 5;
            $scope.employeeLst = [];
            $scope.filteredItems = [];
            $scope.groupedItems = [];
            $scope.itemsPerPage = 5;
            $scope.pagedItems = [];
            $scope.currentPage = 0;
            $scope.showRoasterGrid = false;
            $rootScope.loggedIn = true;
            $rootScope.isHomeMenu = true;
            $rootScope.isAttendanceMenu = false;
            $rootScope.isAddUserMenu = false;
            $rootScope.isSearchUserMenu = false;
            $rootScope.isMyProfileMenu = false;
            $rootScope.isMyRosterMenu = false;
            $rootScope.isMyRequestMenu = false;
            $localStorage.currentMenu = controllerType;
            $localStorage.isAdmin = ($localStorage.isAdmin == undefined) ? $rootScope.isAdmin : $localStorage.isAdmin;
            $rootScope.notAdmin = ($localStorage.isAdmin) ? false : true;
            $localStorage.isReportAdmin = ($localStorage.isReportAdmin == undefined) ? $rootScope.isReportAdmin : $localStorage.isReportAdmin;
            $rootScope.notReportAdmin = ($localStorage.isReportAdmin) ? false : true;
            $rootScope.pageTitle = 'Lennox Shift Rostering Tool :: Search Roster';
            break;
        case 'AddAttendance':
            $scope.newFrmDtObj = [];
            $scope.newToDtObj = [];
            $scope.newShftObj = [];
            $scope.displaySearch = false;
            $scope.showReportingMgr = false;
            $scope.employeeLst = [];
            $scope.gap = 5;
            $scope.filteredItems = [];
            $scope.groupedItems = [];
            $scope.itemsPerPage = 3;
            $scope.pagedItems = [];
            $scope.currentPage = 0;
            $rootScope.loggedIn = true;
            $rootScope.isHomeMenu = false;
            $rootScope.isAttendanceMenu = true;
            $rootScope.isAddUserMenu = false;
            $rootScope.isSearchUserMenu = false;
            $rootScope.isMyProfileMenu = false;
            $rootScope.isMyRosterMenu = false;
            $rootScope.isMyRequestMenu = false;
            $("#singleEntry").show();
            $("#bulkEntry").hide();
            $localStorage.currentMenu = controllerType;
            $localStorage.isAdmin = ($localStorage.isAdmin == undefined) ? $rootScope.isAdmin : $localStorage.isAdmin;
            $rootScope.notAdmin = ($localStorage.isAdmin) ? false : true;
            $localStorage.isReportAdmin = ($localStorage.isReportAdmin == undefined) ? $rootScope.isReportAdmin : $localStorage.isReportAdmin;
            $rootScope.notReportAdmin = ($localStorage.isReportAdmin) ? false : true;
            $rootScope.pageTitle = 'Lennox Shift Rostering Tool :: Add Roster';
            disableKeyPressEvent('#employeeId');
            $("input[type=\"checkbox\"], input[type=\"radio\"]").not("[data-switch-no-init]").bootstrapSwitch();
            break;
        case 'EditAttendance':
            $rootScope.loggedIn = true;
            $rootScope.isHomeMenu = false;
            $rootScope.isAttendanceMenu = true;
            $rootScope.isAddUserMenu = false;
            $rootScope.isSearchUserMenu = false;
            $rootScope.isMyProfileMenu = false;
            $rootScope.isMyRosterMenu = false;
            $rootScope.isMyRequestMenu = false;
            $localStorage.currentMenu = controllerType;
            $localStorage.isAdmin = ($localStorage.isAdmin == undefined) ? $rootScope.isAdmin : $localStorage.isAdmin;
            $rootScope.notAdmin = ($localStorage.isAdmin) ? false : true;
            $localStorage.isReportAdmin = ($localStorage.isReportAdmin == undefined) ? $rootScope.isReportAdmin : $localStorage.isReportAdmin;
            $rootScope.notReportAdmin = ($localStorage.isReportAdmin) ? false : true;
            $rootScope.pageTitle = 'Lennox Shift Rostering Tool :: Edit Roster';
            disableKeyPressEvent('#employeeId');
            break;
        case 'AddUser':
            $rootScope.loggedIn = true;
            $rootScope.isHomeMenu = false;
            $rootScope.isAttendanceMenu = false;
            $rootScope.isAddUserMenu = true;
            $rootScope.isSearchUserMenu = false;
            $rootScope.isMyProfileMenu = false;
            $rootScope.isMyRosterMenu = false;
            $rootScope.isMyRequestMenu = false;
            $localStorage.currentMenu = controllerType;
            $localStorage.isAdmin = ($localStorage.isAdmin == undefined) ? $rootScope.isAdmin : $localStorage.isAdmin;
            $rootScope.notAdmin = ($localStorage.isAdmin) ? false : true;
            $localStorage.isReportAdmin = ($localStorage.isReportAdmin == undefined) ? $rootScope.isReportAdmin : $localStorage.isReportAdmin;
            $rootScope.notReportAdmin = ($localStorage.isReportAdmin) ? false : true;
            $rootScope.pageTitle = 'Lennox Shift Rostering Tool :: Add Profile';
            disableKeyPressEvent('#employeeId');
            disableKeyPressEvent('#contactNumber');            
            disableKeyPressEvent('#zipCode');
            break;
        case 'EditUser':
            $scope.roleLst = [];
            $rootScope.loggedIn = true;
            $rootScope.isHomeMenu = false;
            $rootScope.isAttendanceMenu = false;
            $rootScope.isAddUserMenu = true;
            $rootScope.isSearchUserMenu = false;
            $rootScope.isMyProfileMenu = false;
            $rootScope.isMyRosterMenu = false;
            $rootScope.isMyRequestMenu = false;
            $localStorage.currentMenu = controllerType;
            $localStorage.isAdmin = ($localStorage.isAdmin == undefined) ? $rootScope.isAdmin : $localStorage.isAdmin;
            $rootScope.notAdmin = ($localStorage.isAdmin) ? false : true;
            $localStorage.isReportAdmin = ($localStorage.isReportAdmin == undefined) ? $rootScope.isReportAdmin : $localStorage.isReportAdmin;
            $rootScope.notReportAdmin = ($localStorage.isReportAdmin) ? false : true;
            $rootScope.pageTitle = 'Lennox Shift Rostering Tool :: Edit Profile';
            disableKeyPressEvent('#employeeId');
            disableKeyPressEvent('#contactNumber');            
            disableKeyPressEvent('#zipCode');
            break;
        case 'MyProfile':
            $scope.roleLst = [];
            $rootScope.loggedIn = true;
            $rootScope.isHomeMenu = false;
            $rootScope.isAttendanceMenu = false;
            $rootScope.isAddUserMenu = false;
            $rootScope.isSearchUserMenu = false;
            $rootScope.isMyProfileMenu = true;
            $rootScope.isMyRosterMenu = false;
            $rootScope.isMyRequestMenu = false;
            $localStorage.currentMenu = controllerType;
            $localStorage.isAdmin = ($localStorage.isAdmin == undefined) ? $rootScope.isAdmin : $localStorage.isAdmin;
            $rootScope.notAdmin = ($localStorage.isAdmin) ? false : true;
            $localStorage.isReportAdmin = ($localStorage.isReportAdmin == undefined) ? $rootScope.isReportAdmin : $localStorage.isReportAdmin;
            $rootScope.notReportAdmin = ($localStorage.isReportAdmin) ? false : true;
            $rootScope.pageTitle = 'Lennox Shift Rostering Tool :: My Profile';
            disableKeyPressEvent('#employeeId');
            disableKeyPressEvent('#contactNumber');            
            disableKeyPressEvent('#zipCode');
            break;
        case 'SearchUser':
            $scope.gap = 5;
            $scope.employeeLst = [];
            $scope.filteredItems = [];
            $scope.groupedItems = [];
            $scope.itemsPerPage = 3;
            $scope.pagedItems = [];
            $scope.currentPage = 0;
            $rootScope.showGrid = false;
            $rootScope.loggedIn = true;
            $rootScope.isHomeMenu = false;
            $rootScope.isAttendanceMenu = false;
            $rootScope.isAddUserMenu = false;
            $rootScope.isSearchUserMenu = true;
            $rootScope.isMyProfileMenu = false;
            $rootScope.isMyRosterMenu = false;
            $rootScope.isMyRequestMenu = false;
            $localStorage.currentMenu = controllerType;
            $localStorage.isAdmin = ($localStorage.isAdmin == undefined) ? $rootScope.isAdmin : $localStorage.isAdmin;
            $rootScope.notAdmin = ($localStorage.isAdmin) ? false : true;
            $localStorage.isReportAdmin = ($localStorage.isReportAdmin == undefined) ? $rootScope.isReportAdmin : $localStorage.isReportAdmin;
            $rootScope.notReportAdmin = ($localStorage.isReportAdmin) ? false : true;
            $rootScope.pageTitle = 'Lennox Shift Rostering Tool :: Search Profile';
            disableKeyPressEvent('#employeeId');
            break;
        case 'MyRoster':
            $scope.gap = 5;
            $scope.employeeLst = [];
            $scope.filteredItems = [];
            $scope.groupedItems = [];
            $scope.itemsPerPage = 5;
            $scope.pagedItems = [];
            $scope.currentPage = 0;
            $scope.showRoasterGrid = false;
            $rootScope.loggedIn = true;
            $rootScope.isHomeMenu = false;
            $rootScope.isAttendanceMenu = false;
            $rootScope.isAddUserMenu = false;
            $rootScope.isSearchUserMenu = false;
            $rootScope.isMyProfileMenu = false;
            $rootScope.isMyRequestMenu = false;
            $rootScope.isMyRosterMenu = true;
            $localStorage.currentMenu = controllerType;
            $localStorage.isAdmin = ($localStorage.isAdmin == undefined) ? $rootScope.isAdmin : $localStorage.isAdmin;
            $rootScope.notAdmin = ($localStorage.isAdmin) ? false : true;
            $localStorage.isReportAdmin = ($localStorage.isReportAdmin == undefined) ? $rootScope.isReportAdmin : $localStorage.isReportAdmin;
            $rootScope.notReportAdmin = ($localStorage.isReportAdmin) ? false : true;
            $rootScope.pageTitle = 'Lennox Shift Rostering Tool :: My Roster';
            break;
        case 'MyRequest':            
            $scope.gap = 5;
            $scope.employeeLst = [];
            $scope.filteredItems = [];
            $scope.groupedItems = [];
            $scope.itemsPerPage = 5;
            $scope.pagedItems = [];
            $scope.currentPage = 0;
            $scope.showRoasterGrid = false;
            $rootScope.loggedIn = true;
            $rootScope.isHomeMenu = false;
            $rootScope.isAttendanceMenu = false;
            $rootScope.isAddUserMenu = false;
            $rootScope.isSearchUserMenu = false;
            $rootScope.isMyProfileMenu = false;
            $rootScope.isMyRosterMenu = false;
            $rootScope.isMyRequestMenu = true;;
            $localStorage.currentMenu = controllerType;
            $localStorage.isAdmin = ($localStorage.isAdmin == undefined) ? $rootScope.isAdmin : $localStorage.isAdmin;
            $rootScope.notAdmin = ($localStorage.isAdmin) ? false : true;
            $localStorage.isReportAdmin = ($localStorage.isReportAdmin == undefined) ? $rootScope.isReportAdmin : $localStorage.isReportAdmin;
            $rootScope.notReportAdmin = ($localStorage.isReportAdmin) ? false : true;
            $rootScope.pageTitle = 'Lennox Shift Rostering Tool :: My Roster';
            break;
        case 'SearchAllowance':
            $scope.gap = 5;
            $scope.employeeLst = [];
            $scope.filteredItems = [];
            $scope.groupedItems = [];
            $scope.itemsPerPage = 5;
            $scope.pagedItems = [];
            $scope.currentPage = 0;
            $scope.showRoasterGrid = false;
            $rootScope.loggedIn = true;
            $rootScope.isHomeMenu = false;
            $rootScope.isAttendanceMenu = false;
            $rootScope.isAddUserMenu = false;
            $rootScope.isSearchUserMenu = false;
            $rootScope.isMyProfileMenu = false;
            $rootScope.isMyRosterMenu = false;
            $rootScope.isMyRequestMenu = false;
            $rootScope.isAllowanceMenu = true;
            $rootScope.isAddAllowanceMenu = false;
            $localStorage.currentMenu = controllerType;
            $localStorage.isAdmin = ($localStorage.isAdmin == undefined) ? $rootScope.isAdmin : $localStorage.isAdmin;
            $rootScope.notAdmin = ($localStorage.isAdmin) ? false : true;
            $localStorage.isReportAdmin = ($localStorage.isReportAdmin == undefined) ? $rootScope.isReportAdmin : $localStorage.isReportAdmin;
            $rootScope.notReportAdmin = ($localStorage.isReportAdmin) ? false : true;
            $rootScope.pageTitle = 'Lennox Shift Rostering Tool :: Search Allowance';
            break;
        case 'AddAllowance':
            $scope.newFrmDtObj = [];
            $scope.newToDtObj = [];
            $scope.newShftObj = [];
            $scope.displaySearch = false;
            $scope.showReportingMgr = false;
            $scope.employeeLst = [];
            $scope.gap = 5;
            $scope.filteredItems = [];
            $scope.groupedItems = [];
            $scope.itemsPerPage = 3;
            $scope.pagedItems = [];
            $scope.currentPage = 0;
            $rootScope.loggedIn = true;
            $rootScope.isHomeMenu = false;
            $rootScope.isAttendanceMenu = false;
            $rootScope.isAddUserMenu = false;
            $rootScope.isSearchUserMenu = false;
            $rootScope.isMyProfileMenu = false;
            $rootScope.isMyRosterMenu = false;
            $rootScope.isMyRequestMenu = false;
            $rootScope.isAllowanceMenu = false;
            $rootScope.isAddAllowanceMenu = true;            
            $localStorage.currentMenu = controllerType;
            $localStorage.isAdmin = ($localStorage.isAdmin == undefined) ? $rootScope.isAdmin : $localStorage.isAdmin;
            $rootScope.notAdmin = ($localStorage.isAdmin) ? false : true;
            $localStorage.isReportAdmin = ($localStorage.isReportAdmin == undefined) ? $rootScope.isReportAdmin : $localStorage.isReportAdmin;
            $rootScope.notReportAdmin = ($localStorage.isReportAdmin) ? false : true;
            $rootScope.pageTitle = 'Lennox Shift Rostering Tool :: Add Allowance';
            disableKeyPressEvent('#employeeId');            
            break;
        case 'EditAllowance':
            $rootScope.loggedIn = true;
            $rootScope.isHomeMenu = false;
            $rootScope.isAttendanceMenu = true;
            $rootScope.isAddUserMenu = false;
            $rootScope.isSearchUserMenu = false;
            $rootScope.isMyProfileMenu = false;
            $rootScope.isMyRosterMenu = false;
            $rootScope.isMyRequestMenu = false;
            $rootScope.isAllowanceMenu = false;
            $rootScope.isAddAllowanceMenu = true;
            $localStorage.currentMenu = controllerType;
            $localStorage.isAdmin = ($localStorage.isAdmin == undefined) ? $rootScope.isAdmin : $localStorage.isAdmin;
            $rootScope.notAdmin = ($localStorage.isAdmin) ? false : true;
            $localStorage.isReportAdmin = ($localStorage.isReportAdmin == undefined) ? $rootScope.isReportAdmin : $localStorage.isReportAdmin;
            $rootScope.notReportAdmin = ($localStorage.isReportAdmin) ? false : true;
            $rootScope.pageTitle = 'Lennox Shift Rostering Tool :: Edit Allowance';
            disableKeyPressEvent('#employeeId');
            break;
    }
}

//Checking the values are present in the Session
function checkSessionStorage($sessionStorage, $scope, $localStorage, $rootScope) {
    var checkSession = true;
    if ($sessionStorage.profileInfo == null && $sessionStorage.profileInfo == undefined) {
        $localStorage.$reset();
        $sessionStorage.$reset();
        $rootScope = $rootScope.$new(true);
        $scope = $scope.$new(true);
        checkSession = false;
        window.location.href = '#/login';
    }
    else {
        checkSession = true;
        $rootScope.isAdmin = ($sessionStorage.profileInfo.RoleName == "Manager") ? true : false;
        $rootScope.isReportAdmin = ($sessionStorage.profileInfo.RoleName == "Report Admin") ? true : false;
        $rootScope.loggedInName = $sessionStorage.profileInfo.FirstName;
        $rootScope.loggedInId = $sessionStorage.profileInfo.Profile_Id;
    }
    return checkSession;
}
//Disabling the Key press events
function disableKeyPressEvent(controlId) {
    $(controlId).keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
}
//Date Format
$.date = function (dateObject) {
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = month + "-" + day + "-" + year;
    return date;
};
function convertToDate(selector) {
    var from = selector.split('-');
    return new Date(from[2], from[0] - 1, from[1]);
}
var convertJSDate = function (dateTime) {
    var dateArr = dateTime.split("-");
    var date1 = new Date(dateArr[2] + "-" + dateArr[0] + "-" + dateArr[1]);
    return date1;
}

//Loading AJAX Post call
function DoAJAXCall(type, serviceUrl, requestData) {
    var responseData = [];
    $.ajax({
        type: type,
        async :false,
        url: serviceUrl,
        contentType: "application/json",
        data: requestData,
        success: function (data, status) {
            responseData = data[0];
        },
        error: function (xhr, desc, err) {
            console.log(xhr);
            console.log("Desc: " + desc + "\nErr:" + err);
        }
    });    
    return responseData;
}
//Rendering Shift Cutoff Dates based on the 20th mid week request
function renderCutoffDate($scope) {    
    if ($scope.notAdmin == true) {
        var now = new Date();        
        var date = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        var cutOffDate = new Date(now.getFullYear(), now.getMonth() + 1, 20);                
        if ($scope.startDate!=undefined)
            $scope.enableRequest = (date >= cutOffDate || date.getMonth() > $scope.startDate.getMonth()) ? true : false;
        else
            $scope.enableRequest = (date >= cutOffDate) ? true : false;
    }
    else
        $scope.enableRequest = false;
}


function constructHtmlTemplate(emailTemplate) {
    var emailHtml = '';
    $.ajax({
        type: "GET",
        async: false,
        url: emailTemplate,       
        success: function (data, status) {            
            var xmlText = new DOMParser();  // For Firefox and rest browsers
            xmlText = xmlText.parseFromString(data, "text/html");
            var oSerializer = new XMLSerializer();
            var sPrettyXML = oSerializer.serializeToString(xmlText);
            emailHtml = sPrettyXML;
        },
        error: function (xhr, desc, err) {
            console.log(xhr);
            console.log("Desc: " + desc + "\nErr:" + err);
        }
    });
    return emailHtml;
}
function sendEmail(serviceType, $scope, subject, emailTemplate) {
    if (sendEmailFlag) {
        var emailHtml = '';
        emailHtml = constructHtmlTemplate(emailTemplate);
        switch (serviceType) {
            case 'NewRegistration':
                emailHtml = emailHtml.replace("@firstName", $scope.firstName);
                emailHtml = emailHtml.replace("@lastName", $scope.lastName);
                emailHtml = emailHtml.replace("@emailId", $scope.emailAddress);
                emailHtml = emailHtml.replace("@password", $scope.password);
                break;
            case 'ChangePassword':
                emailHtml = emailHtml.replace("@firstName", $scope.firstName);
                emailHtml = emailHtml.replace("@lastName", $scope.lastName);
                emailHtml = emailHtml.replace("@password", $scope.password);
                break;
            case 'NewRoster':
                emailHtml = emailHtml.replace("@firstName", $scope.firstName);
                emailHtml = emailHtml.replace("@lastName", $scope.lastName);
                emailHtml = emailHtml.replace("@employeeId", $scope.employeeId);
                emailHtml = emailHtml.replace("@emailId", $scope.emailAddress);
                emailHtml = emailHtml.replace("@fromDate", $.date($scope.startDate));
                emailHtml = emailHtml.replace("@toDate", $.date($scope.endDate));
                emailHtml = emailHtml.replace("@shift", $scope.shift.ShiftName);
                break;
            case 'NewRequestManager':
                emailHtml = emailHtml.replace("@managerName", $scope.managerName);
                emailHtml = emailHtml.replace("@firstName", $scope.firstName);
                emailHtml = emailHtml.replace("@lastName", $scope.lastName);
                emailHtml = emailHtml.replace("@employeeId", $scope.employeeId);
                //Added for loading old history details
                emailHtml = emailHtml.replace("@oldFromDate", $scope.oldStartDate);
                emailHtml = emailHtml.replace("@oldToDate", $scope.oldEndDate);
                emailHtml = emailHtml.replace("@oldShift", $scope.oldShiftName);
                //Setting to email address as manager email address
                emailHtml = emailHtml.replace("@emailId", profileData[0].EmailAddress);
                emailHtml = emailHtml.replace("@fromDate", $.date($scope.startDate));
                emailHtml = emailHtml.replace("@toDate", $.date($scope.endDate));
                emailHtml = emailHtml.replace("@shift", $scope.shift.ShiftName);
                emailHtml = emailHtml.replace("@comments", $scope.comments);
                var loadProfileData = { "employeeId": $scope.managerId };
                var profileData = DoAJAXCall("POST", searchProfileService, JSON.stringify(loadProfileData));
                break;
            case 'NewRequestEmployee':
                emailHtml = emailHtml.replace("@firstName", $scope.firstName);
                emailHtml = emailHtml.replace("@lastName", $scope.lastName);
                emailHtml = emailHtml.replace("@employeeId", $scope.employeeId);
                emailHtml = emailHtml.replace("@emailId", $scope.emailAddress);
                emailHtml = emailHtml.replace("@fromDate", $.date($scope.startDate));
                emailHtml = emailHtml.replace("@toDate", $.date($scope.endDate));
                emailHtml = emailHtml.replace("@shift", $scope.shift.ShiftName);
                emailHtml = emailHtml.replace("@comments", $scope.comments);
                emailHtml = emailHtml.replace("@status", "Pending");
                break;
            case 'RejectRequest':
                emailHtml = emailHtml.replace("@firstName", $scope.firstName);
                emailHtml = emailHtml.replace("@lastName", $scope.lastName);
                emailHtml = emailHtml.replace("@employeeId", $scope.employeeId);
                emailHtml = emailHtml.replace("@emailId", $scope.emailAddress);
                emailHtml = emailHtml.replace("@fromDate", $.date($scope.startDate));
                emailHtml = emailHtml.replace("@toDate", $.date($scope.endDate));
                emailHtml = emailHtml.replace("@shift", $scope.ShiftName);
                emailHtml = emailHtml.replace("@comments", $scope.comments);
                emailHtml = emailHtml.replace("@status", "Rejected");
                break;
            case 'ApprovedRequest':
                emailHtml = emailHtml.replace("@firstName", $scope.firstName);
                emailHtml = emailHtml.replace("@lastName", $scope.lastName);
                emailHtml = emailHtml.replace("@employeeId", $scope.employeeId);
                emailHtml = emailHtml.replace("@emailId", $scope.emailAddress);
                emailHtml = emailHtml.replace("@fromDate", $.date($scope.startDate));
                emailHtml = emailHtml.replace("@toDate", $.date($scope.endDate));
                emailHtml = emailHtml.replace("@shift", $scope.ShiftName);
                emailHtml = emailHtml.replace("@comments", $scope.comments);
                emailHtml = emailHtml.replace("@status", "Approved");
                break;
        }        
        var ccEmail = (serviceType == "ApprovedRequest") ? "LITCADMIN@Lennoxintl.com;Muthukumar.Ramakrishnan@Lennoxintl.com;Dinesh.Udayasuriyan@Lennoxintl.com;Jayakumar.Palani@Lennoxintl.com;Sudarson.Krishnamoorthy@Lennoxintl.com;" : "";
        var requestData = {
            "to": $scope.emailAddress,
            "cc": ccEmail,
            "subject": subject,
            "html": emailHtml
        };
        DoAJAXCall("POST", sendEmailService, JSON.stringify(requestData));
    }
}

