(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceOutrescueOutrescuecheckController', TserviceOutrescueOutrescuecheckController);
  function TserviceOutrescueOutrescuecheckController($uibModalInstance,$rootScope,OutrescueService, Message, workOrder,closeReason,vin,robAccount) {
    var vm = this;
    vm.title="工单关闭";
    vm.reason=closeReason;
    vm.query={
      woCode:workOrder,
      woStatus:'2',
      vin:vin,
      operatorId:$rootScope.userInfo.userId,
      operatorType:'2',
      operateStatus:'',
      operateMsg:''
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss();
    };


    //关闭工单
    vm.workOrderClosed=function () {
      vm.query.operateStatus = '9';

      vm.query.operatorId = robAccount;
      OutrescueService.UpdateWorkOrderStatus(vm.query)
        .then(function () {
          $uibModalInstance.close();
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    };

    //驳回
    vm.rejectWorkOrder=function () {
      vm.query.operateStatus = '4';
      OutrescueService.UpdateWorkOrderStatus(vm.query)
        .then(function () {
          $uibModalInstance.close();
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }
  }

})();
