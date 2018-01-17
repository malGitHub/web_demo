/**
 * Created by ligj on 2015/12/15.
 */
(function () {
	'use strict';

	angular.module('WeComponents')

		/**
		 * 车辆品牌选择指令
		 *
		 * 用法 <div wd-select-auto="" select="xxxx" change="xxx"></div>
		 *
		 *
		 *
		 *
		 */
		.directive('wdSelectAuto', function ($timeout, CommonService, Message) {
			return {
				templateUrl: 'app/components/select-auto/select.html',
				replace: true,
				scope: {
					select: '=',
					change: '='
				},
				controller: function ($element, $scope) {

					var $change = function (select) {
						var _select = angular.copy(select);
						_select.brandId === 'all' && (_select.brandId = null);
						_select.carLineId === 'all' && (_select.carLineId = null);

						$scope.select && ($scope.select = _select);
						$timeout(function () {
							$scope.change && $scope.change(_select);
						});
					};

					$scope.isOpen = false;

					$scope.$select = {
						brandId: 'all',
						brandName: '全部品牌',
						carLineId: '',
						carLineName: ''
					};

					var error = function (err) {
						Message.error(err.msg);
					};

					var firstBrand = {},
						brands = [{name: '全部品牌', id: 'all'}],
						labels = '热ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

					CommonService.baseDataFirstBrand().then(function (r) {
						r.forEach(function (item) {
							if (item.hotBrand) {
								firstBrand[item.hotBrand] = firstBrand[item.hotBrand] || [];
								firstBrand[item.hotBrand].push({name: item.name, id: item.id});
							}
							if (item.fLetter) {
								firstBrand[item.fLetter] = firstBrand[item.fLetter] || [];
                var isRepeat=firstBrand[item.fLetter].some(function (e) {
                  return e.name==item.name;
                });
                if(!isRepeat){
                  firstBrand[item.fLetter].push({name: item.name, id: item.id});
                }
							}
						});
						labels.forEach(function (item) {
							var flag=null;
							if(item=='热'){flag=1}else{flag=item};
							if (firstBrand[flag]) {
								brands.push({name: (item === '热' ? '热门' : item), mark: item});
								brands = brands.concat(firstBrand[flag]);
							}
						});
						$scope.brand = brands;

					}, error);


					var delWatch;
					delWatch = $scope.$watchCollection('isOpen', function () {
						$timeout(function () {
							var _dom = $element.find('.select-auto-list');
							_dom.height(_dom.find('.select-auto-dropdown-label >ul').eq(0).height());
							_dom.height() > 0 && delWatch();
						}, 100);
					});

					$scope.labels = labels;

					function getCarLine(brand, callBack) {
						var carLine = [
							{name: '全部车系', id: 'all'}
						];
						CommonService.baseDataThirdBrand(brand).then(function (r) {
							r.forEach(function (item) {
								carLine.push({name: item.secondName, mark: item.secondId});
								item.thirdList.forEach(function (item2) {
									carLine.push({name: item2.thirdName, id: item2.thirdId});
								});
							});
							callBack(carLine);
						});
					}

					$scope.selectLabels = function (label,$event) {
						$event && $event.stopPropagation();
						if (!label) return;
						var _select = $element.find('.select-auto-dropdown-barnd >ul >li[brand-mark=\'' + label + '\']');
						if(_select.length > 0){
							var	_top = _select.offset().top - _select.parent().offset().top;
							angular.element('.select-auto-dropdown-barnd').animate({scrollTop: _top}, 300);
						}
					};

					var barndLis, carLineLis;
					$scope.selectBrand = function (brand, index, name, $event) {
						$event && $event.stopPropagation();
						barndLis = barndLis || $element.find('.select-auto-dropdown-barnd >ul >li');

						if (angular.isDefined(brand)) {
							$timeout(function () {
								if (brand === 'all') {
									$scope.carLine = [];
									$scope.isOpen = false;
								} else {
									getCarLine(brand, function (r) {
										$scope.carLine = r;
									});
								}
								barndLis.removeClass('active');
								barndLis.eq(index).addClass('active');

								$scope.$select = {
									brandId: brand,
									brandName: name,
									carLineId: '',
									carLineName: ''
								};

								carLineLis = null;

								$scope.selectCarLine('all', 0);
								//$scope.change($scope.select);
							});
						}
					};

					$scope.selectCarLine = function (carLine, index, name, $event) {
						$event && $event.stopPropagation();
						$timeout(function () {
							carLineLis = (carLineLis && carLineLis.length > 0) ? carLineLis : $element.find('.select-auto-dropdown-car-line >ul >li');
							if (angular.isDefined(carLine)) {
								carLineLis.removeClass('active');
								carLineLis.eq(index).addClass('active');
								$scope.$select.carLineId = carLine;
								$scope.$select.carLineName = name;
								$change($scope.$select);
							}
							typeof (carLine) != "undefined" && $event && ($scope.isOpen=false);
						});
					};

				}
			}
		});
})();
