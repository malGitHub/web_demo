/**
 * Created by ligj on 2015/12/15.
 */
(function () {
	'use strict';

	angular.module('WeComponents')

		.directive('wdSelectArea', function ($timeout, CommonService) {
			return {
				templateUrl: 'app/components/select-area/select.html',
				replace: true,
				scope: {
					select: '=',
					change: '='
				},
				controller: function ($scope) {
					var areas = [{province: '全国'}];
					CommonService.baseDataArea().then(function (r) {
						$scope.areaList = areas.concat(r.list);
						$scope.select = $scope.areaList[0];
					});


					$scope.selectArea = function (area) {
						$scope.select = area;
						$timeout(function () {
							$scope.change && $scope.change($scope.select);
						});
					};

				}
			}
		});
})();