(function() {
  'use strict';

  angular
    .module('wedriveOperationPlatform', [
	    // 'ngAnimate',
	    'ngSanitize',
	    'ui.router',
	    'ui.bootstrap',
	    'toastr',
	    'WeComponents',
	    'WeServices',
	    'WeUtils',
	    'WeViews',
	    'wedriveBaseLib',
	    'angular-loading-bar',
      'angularMapbarMap',
      'treeControl',
      'ngNiceBar'
    ])
    .directive('fileModel', ['$parse', function ($parse) {
      return {
        restrict: 'A',
        link: function (scope, element, attr) {
          var model = $parse(attr.fileModel);
          var modelSetter = model.assign;

          element.bind('change', function () {
            scope.$apply(function () {
              modelSetter(scope, element[0].files[0]);
            });
          });
        }
      };
    }]);

})();
