/**
 * Created by Administrator on 2017/3/24.
 */
(function () {
  'use strict';

  angular.module('WeViews')
    .controller('TserviceActivitiesnewPhoneController', TserviceActivitiesnewPhoneController);

  function TserviceActivitiesnewPhoneController($uibModalInstance,carChassisNumErrList,carChassisNumList) {
    var vm = this;
    //查看非法号码原因
    vm.illegalCause  = false;
    vm.showCauseAll= function () {
      vm.illegalCause = true;
    };
    //关闭
    vm.closeCauseAll = function () {
      vm.illegalCause = false;
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss();
      };
     vm.data={
       carChassisNumErrList:carChassisNumErrList,
       carChassisNumList:carChassisNumList
    };
       vm.deleList=function () {
       $uibModalInstance.close(vm.data.carChassisNumList);
    }
  }
})();
