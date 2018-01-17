/**
 * Created by ligj on 2015/12/15.
 */
(function () {
	'use strict';

	angular.module('WeComponents')

		.directive('wdSort', function ($timeout) {
			return {
				template: '<span ng-transclude style="cursor: pointer;"></span>' +
				'<span ng-if="sortCol == $sortCol && sortType == 1" style="cursor: pointer;" class="glyphicon glyphicon-arrow-up"></span>' +
				'<span ng-if="sortCol == $sortCol && sortType == 2" style="cursor: pointer;" class="glyphicon glyphicon-arrow-down"></span>',
				transclude: true,
				scope: {
					sortCol: '=',
					sortType: '=',
					defSortType: '=',
					change: '='
				},
				link: function ($scope, $element, $attrs) {
					$scope.$sortCol = $attrs['wdSort'];
					$element.on('click', function () {
						$timeout(function () {
							if ($scope.sortCol == $scope.$sortCol) {
								$scope.sortType = 3 - $scope.sortType;
							} else {
								$scope.sortCol = $scope.$sortCol;
								$scope.sortType = $scope.defSortType || 2;
							}
							$timeout(function () {
								$scope.change && $scope.change($scope.sortCol, $scope.sortType);
							});
						});
					});
				}
			}
		});
})();
