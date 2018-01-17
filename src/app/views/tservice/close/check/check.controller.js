(function () {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceCloseCheckController', TserviceCloseCheckController);
  function TserviceCloseCheckController($uibModalInstance,$rootScope, Message,filter,CustomerService,OperateService) {
    var vm = this;
    vm.title = "工单关闭";
    vm.requesting=false;
     //获取当前使用者userId
    vm.userId=$rootScope.userInfo.userId;
    //判断当前使用者角色
      OperateService.queryRuleList(vm.userId)
        .then(function (data) {
          if(data.masterFlg){
            vm.masterFlg="1";
          }else{
            vm.masterFlg="2";
          }
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    //关闭原因
    vm.reason=filter.closeReason;
    //关闭模态框
    vm.closeEdit = function () {
      $uibModalInstance.dismiss();
    };
    //同意关闭
    vm.agree = function () {
      vm.requesting=true;
      var Status='10';
      CustomerService.ModifyWo(filter.woCode,Status)
        .then(function () {
           operate(filter,"8");
        })
        .catch(function (err) {
          vm.requesting=false;
          $rootScope.catchError(err);
        });
    };
    //驳回
    vm.disagree = function () {
      vm.requesting=true;
       operate(filter,"14");
    };
    //操作日志
    function operate(filter,Status){
      CustomerService.AddOperate(filter.woCode,filter.woStatus,filter.carVin,vm.userId,vm.masterFlg,Status,vm.stationReason+';'+vm.userReason)
        .then(function () {
          $uibModalInstance.close();
        })
        .catch(function (err) {
          vm.requesting=false;
           $rootScope.catchError(err);
        });
    }

  }

})();
