(function () {

    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceBuildController', TserviceBuildController);
    /** @ngInject */
    function TserviceBuildController($rootScope,$interval, WorkOrderService) {

        //构造方法
        var vm = this;
      //每分钟刷新列表
      $rootScope.interval = $interval(function () {
        getData2()
      }, 1000 * 60);
        //分页相关
        vm.pageIndex = 1;
        vm.pageSize = 10;

        //检索相关
        vm.query={
          woId: '',
          chassisCode: '',
          engineCode: '',
          carModel:'',
          carCph: ''
        };
        vm.getData=function () {
          getData();
        };
        //初始化查询获取列表
        function getData() {
          WorkOrderService.carInfoList(vm.pageIndex,vm.pageSize,vm.query)
              .then(function (data) {
                  vm.carInfoList = data.list;
                  vm.total = data.total;
              })
              .catch(function (err) {
                  $rootScope.catchError(err);
              });
        }
        getData();
      function getData2() {
        WorkOrderService.carInfoList(vm.pageIndex,vm.pageSize,vm.query)
          .then(function (data) {
            vm.carInfoList = data.list;
            vm.total = data.total;
          })
          .catch(function (err) {
            $rootScope.consoleError(err);
          });
      }
      vm.getData = function () {
        getData()
      };

        vm.flip = function (pageIndex) {
             vm.pageIndex = pageIndex;
             getData()
        };

        //高级筛选
        vm.moreobject = false;
        vm.formoreobj = function () {
            vm.moreobject = !vm.moreobject;
        };


    }
})();

