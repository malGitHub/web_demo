/**
 * Created by Administrator on 2017/3/24.
 */
(function () {
  'use strict';

  angular.module('WeViews')
    .controller('TserviceMessagechitaddPhoneController', TserviceMessagechitaddPhoneController);

  function TserviceMessagechitaddPhoneController($uibModalInstance,userPhoneNumbersErr, userPhoneNumbers) {
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
      userPhoneNumbersErr:userPhoneNumbersErr,
       userPhoneNumbers:userPhoneNumbers
    };
    vm.data.userPhoneNumbersErr=vm.data.userPhoneNumbersErr.split(",");
      vm.deleList=function () {
      /*vm.data.userPhoneNumbersErr="";*/
      $uibModalInstance.close(vm.data.userPhoneNumbers);
    }
  }
})();
