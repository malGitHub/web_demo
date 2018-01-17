(function () {
	'use strict';

	angular.module('WeComponents')
		/**
		 * http://www.bootcss.com/p/bootstrap-datetimepicker/
		 * http://www.malot.fr/bootstrap-datetimepicker/#options
		 * demo
		 * <wd-date-picker
		                    format="yyyy-mm-dd hh:ii:ss" 格式   默认 yyyy-mm-dd
		                    view="day" 最小视图minView 可选 day:天，hour：小时    默认day
		                    is-empty-show="true" 是否显示清空 默认false
	                        ng-change="sim.onFilter()" 同ngChange
		                    ng-model="sim.query.endDate" 同ngModel
							 startDate="xxx" 允许选择的开始时间
							 endDate="xxx" 允许选择的结束时间
		 ></wd-date-picker>
		 */
		.directive('wdDatePicker', function ($timeout) {
			return {
				scope: {
					minView: '@view',
					startDate: '=',
					endDate: '=',
					ngModel: '=',
					format: '@',
					isEmptyShow: '='
				},
				require: 'ngModel',
				// template : function () {
				// 	return [
				// 		'<div class="mp-date-time-pick">'+
				// 			'<input class="form-control mp-date-input" ng-model="ngModel" ' +
				// 				//'size="{{size || 16}}" ' +
				// 				'type="text" ' +
				// 				'readonly ng-change="change()">'+
				// 			'<span ng-if="!(ngModel && isEmptyShow)" ng-click="triggerClick()" class="glyphicon glyphicon-calendar mp-date-btn"></span>'+
				// 			'<span ng-if="ngModel && isEmptyShow" ng-click="empty()" title="清空" class="glyphicon glyphicon-remove mp-date-btn"></span>'+
				// 		'</div>'
				// 	].join('');
				// },
        template : function () {
          return [
            '<div class="mp-date-time-pick">'+
            '<input class="form-control mp-date-input" ng-model="ngModel" ' +
            //'size="{{size || 16}}" ' +
            'type="text" ' +
            'readonly ng-change="change()">'+
            '<span ng-if="!(ngModel)" ng-click="triggerClick()" class="glyphicon glyphicon-calendar mp-date-btn"></span>'+
            '<span ng-if="ngModel" ng-click="empty()" title="清空" class="glyphicon glyphicon-remove mp-date-btn"></span>'+
            '</div>'
          ].join('');
        },
				replace : true,
				link: function ($scope, $element, $attrs, ctrl) {
					var minView = 0, dom = $element.find('input').eq(0);

					$scope.minView = $scope.minView || 'day';

					switch ($scope.minView) {
						case 'day':
							minView = 2;
							break;
						case 'hour':
							minView = 1;
							break;
					}


					$timeout(function () {
						if (!$attrs.readonly) {
							dom.datetimepicker({
								language: 'zh-CN',
								format: $scope.format || 'yyyy.mm.dd',
								//weekStart: 1,
								//todayBtn:  1,
								autoclose: 1,
								todayHighlight: 1,
								minView: minView,
								pickerPosition: "bottom-right",
								startDate: $scope.startDate,
								endDate: $scope.endDate

								//initialDate : 'new Date()'
								//startView: 2,
								//forceParse: 0,
								//showMeridian: 1
							});
							$scope.$watchCollection('startDate', function (startDate) {
								dom.datetimepicker('setStartDate', startDate);
							});
							$scope.$watchCollection('endDate', function (endDate) {
								dom.datetimepicker('setEndDate', endDate);
							});
						} else {
							dom.datetimepicker('remove');
						}
					}, 100);

					$scope.change = function () {
						$timeout(function(){
							ctrl.$viewChangeListeners.forEach(function (item) {
								typeof item === 'function' && item();
							});
						});
					};
					$scope.empty = function () {
						$scope.ngModel = '';
						$scope.change();
					};
					$scope.triggerClick = function () {
						dom.datetimepicker('show');
					};
				}
			}
		});
})();
