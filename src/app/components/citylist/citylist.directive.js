/**
 * Created by ligj on 2015/7/20.
 */

(function() {
    'use strict';

    angular
        .module('WeComponents')
        .directive('asCityList', function ($timeout, MyService) {
            return {
                restrict : 'EA',
                scope : {
                    selectPro : '=asSelectPro',
                    selectCity : '=asSelectCity',
                    proChange: '=asSelectChange',
                    queryType: '@asQueryType'
                },
                replace: false,
                templateUrl : 'app/components/citylist/citylist.html',
                controller : function ($scope) {

                    MyService.getProvinceList().then(function (pros) {
                        $scope.provinces = pros;
                    });
                    $scope.changePro = function () {
                        var pro='';
                        
                        $scope.provinces.forEach(function(k){
                          if($scope.selectPro== k.id){
                            pro=$scope.selectPro;
                          }else if($scope.selectPro== k.carCode){
                            pro= k.id;
                          }
                        });

                       
                        if(!$scope.selectPro){
                          $scope.citys = [];
                        }else{
                          MyService.getCityList(pro).then(function (citys) {
                            $scope.citys = citys;
                          });
                        }

                        $timeout(function () {
                            $scope.proChange && $scope.proChange();
                        });
                    };
                    $scope.changeCity = function () {
                      $timeout(function () {
                        $scope.proChange && $scope.proChange();
                      });
                    };
                },
                link : function ($scope, $element) {

                }
            };
        })
})();
