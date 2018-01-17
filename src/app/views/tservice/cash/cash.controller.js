(function () {

  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceCashController', TserviceCashController);
  /** @ngInject */
  function TserviceCashController($rootScope, CashService,$filter) {
    //构造方法
    var vm = this;

    //分页相关
    vm.pageIndex = 1;
    vm.pageSize = 10;
    vm.total;

    //检索相关
    vm.inputText = '';//检索条件

    vm.refresh_time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');

    //初始化查询获取列表
    getCashData();

    vm.flip = function () {
      getCashData();
    };

    //根据条件查询获取列表
    function getCashData() {
      CashService.getExchangeList(vm.inputText, vm.pageIndex, vm.pageSize)
        .then(function (data) {
          vm.cashData = data.list;
          vm.total = data.total;//设置分页总数
          vm.refresh_time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }

    /**
     * 条件检索
     */
    vm.changeDate = function () {
      getCashData()
    };

    vm.unitTool = function (count) {
      if (count.match(/^-?[0-9]+$/) == count) {
        return true;
      } else {
        return false;
      }
    };

    vm.queryKeyUp = function(e){
      var keycode = window.event?e.keyCode:e.which;
      if(keycode==13){
        getCashData();
      }
    };
  }
})();

