(function() {
    'use strict';

    angular
        .module('WeComponents')
        .directive('weNavbar', weNavbar);

    var defaults = {
        activeClass: 'active',
        routeAttr: 'data-match-route',
        strict: false
    };

    /** @ngInject */
    function weNavbar( ssoConfig) {
        return {
            restrict: 'AE',
            templateUrl: 'app/components/navbar/navbar.html',
            link: function (scope, element, attr) {

	            scope.ssoConfig = ssoConfig;

                //var options = angular.copy(defaults);
                //angular.forEach(Object.keys(defaults), function (key) {
                //    if (angular.isDefined(attr[key])) {
                //        options[key] = attr[key];
                //    }
                //});
                //
                //scope.$watch(function () {
                //    return $location.path();
                //}, function (newValue) {
                //    var liElements = element[0].querySelectorAll('li[' + options.routeAttr + ']');
                //    angular.forEach(liElements, function (li) {
                //        var liElement = angular.element(li);
                //        var pattern = liElement.attr(options.routeAttr).replace('/', '\\/');
                //        if (options.strict) {
                //            pattern = '^' + pattern + '$';
                //        }
                //        var regexp = new RegExp(pattern, 'i');
                //        if (regexp.test(newValue)) {
                //            liElement.addClass(options.activeClass);
                //        } else {
                //            liElement.removeClass(options.activeClass);
                //        }
                //    });
                //});
            }
        };
    }
})();
