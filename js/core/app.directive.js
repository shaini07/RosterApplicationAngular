'use strict';
angular
.module('directive', [])
.directive('header', function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: "views/Home/Header.htm",
        controller: ['$scope', '$filter', function ($scope, $filter) {
            // Your behaviour goes here :)
        }]
    }
})
.directive('footer', function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: "views/Home/Footer.htm",
        controller: ['$scope', '$filter', function ($scope, $filter) {
            // Your behaviour goes here :)
        }]
    }
})
.directive('tabKey', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 9) {
                scope.$apply(function () {
                    scope.$eval(attrs.tabKey);
                });

                event.preventDefault();
            }
        });
    };
})
.directive('showErrors', function ($timeout) {
    return {
        restrict: 'A',
        require: '^form',
        link: function (scope, el, attrs, formCtrl) {
            // find the text box element, which has the 'name' attribute
            var inputEl = el[0].querySelector("[name]");
            // convert the native text box element to an angular element
            var inputNgEl = angular.element(inputEl);
            // get the name on the text box
            var inputName = inputNgEl.attr('name');

            // only apply the has-error class after the user leaves the text box				
            var blurred = false;
            inputNgEl.bind('blur', function () {
                blurred = true;
                el.toggleClass('has-error', formCtrl[inputName].$invalid);
            });
            scope.$watch(function () {
                if (formCtrl[inputName] === undefined) {
                    return false;
                } else {
                    return formCtrl[inputName].$invalid;
                }
            }, function (invalid) {
                // we only want to toggle the has-error class after the blur
                // event or if the control becomes valid
                if (!blurred && invalid) { return }
                el.toggleClass('has-error', invalid);
            });


            scope.$on('show-errors-check-validity', function () {
                el.toggleClass('has-error', formCtrl[inputName].$invalid);
            });
            scope.$on('show-errors-reset', function () {
                $timeout(function () {
                    el.removeClass('has-error');
                }, 0, false);
            });
        }
    }
});




