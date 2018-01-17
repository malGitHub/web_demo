
/**
 * Created by wangshuai on 2016/11/14.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceDealorderCancelController', TserviceDealorderCancelController);
  function TserviceDealorderCancelController($uibModalInstance,$rootScope,Message,filter,CustomerService) {
    var vm = this;
    vm.title="取消工单";
    vm.requesting=false;
    vm.userId=$rootScope.userInfo.userId;
    vm.userContent='';
    vm.serviceStationContent='';
    //判断当前使用者角色
    vm.masterFlg="2";

    vm.close = function (){
      $uibModalInstance.dismiss();
    };

    vm.submit = function (evt,form) {
      evt.preventDefault();
      if (form.$valid && !vm.requesting){
        vm.requesting=true;
        CustomerService.ModifyWo(filter.woCode,"10")
          .then(function () {
            operate(filter,"8","10");
          })
          .catch(function (err) {
            vm.requesting=false;
            $rootScope.catchError(err);
          })
      }

    };

    //操作日志
    function operate(filter,Status,woStatus){
      CustomerService.AddOperate(filter.woCode,woStatus,filter.carVin,vm.userId,vm.masterFlg,Status,vm.serviceStationContent+";"+vm.userContent)
        .then(function () {
          Message.success('工单取消成功！');
          $uibModalInstance.close();
        })
        .catch(function (err) {
          vm.requesting=false;
          $rootScope.catchError(err);
        });
    }
  }

})();

