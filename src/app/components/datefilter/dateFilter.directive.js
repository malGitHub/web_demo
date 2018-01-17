(function () {
	'use strict';

	angular.module('WeComponents')

		.directive('wdDateFilter', function (DateUtil, $timeout) {
			return {
				scope: {
					time: '=wdDateFilter',
					query: '=query',
					change: '='
				},
				transclude: true,
				replace: true,
				controller: function ($scope) {

					$scope.isInit = false;
					var nowDate = new Date(), format = 'yyyy.MM.dd';
					var change = function () {
						$timeout(function () {
							$scope.change && $scope.change($scope.time);
						});
					};

					$scope.setType = function (type) {
						$scope.time.type = type;
						switch (type) {
							case 1:
								$scope.time.start = '2000.01.01';
								$scope.time.end = DateUtil.mactchStrToTime(nowDate, '-1d', format);
								break;
							case 2:
								$scope.time.start = DateUtil.mactchStrToTime(nowDate, '-1d', format);
								$scope.time.end = DateUtil.mactchStrToTime(nowDate, '-1d', format);
                $scope.time.dayNum=1;
								break;
							case 3:
								$scope.time.start = DateUtil.mactchStrToTime(nowDate, '-7d', format);
								$scope.time.end = DateUtil.mactchStrToTime(nowDate, '-1d', format);
                $scope.time.dayNum=7;
								break;
							case 4:
								$scope.time.start = DateUtil.mactchStrToTime(nowDate, '-30d', format);
								$scope.time.end = DateUtil.mactchStrToTime(nowDate, '-1d', format);
                $scope.time.dayNum=30;
								break;
              case 5:
                //console.log(changeTime($scope.time.end));
                $scope.time.dayNum=changeTime($scope.time.end)-changeTime($scope.time.start)+1;
                break;
						}
						$scope.isInit && change();
						$scope.isInit = true;
					};

					$scope.time = $scope.time || {type: 2};

					$scope.setType($scope.time.type);

					$scope.timeChange = function () {
            $scope.setType(5);
					};
          //把格式化的时间改为天数
          function changeTime(time){
            var arr = time.split(".");
            var datum = new Date(Date.UTC(arr[0],arr[1]-1,arr[2]));
            return datum.getTime()/1000/60/60/24;
          }

				},
				templateUrl: 'app/components/datefilter/dateFilter.html'
			};
		});

})();
