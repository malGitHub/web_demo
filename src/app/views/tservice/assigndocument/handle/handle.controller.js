
(function () {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceAssigndocumentHandleController', TserviceAssigndocumentHandleController);
  function TserviceAssigndocumentHandleController($uibModalInstance,$rootScope,CustomerService,FILTER,dealer) {
    var vm = this;
    vm.title = "我要处理";
    vm.requesting=false;
    vm.dealer = $rootScope.userInfo.userId;
    vm.dealername=$rootScope.userInfo.userName;
    vm.closeEdit = function () {
      $uibModalInstance.dismiss();
    };
    vm.handle={
      woCode:FILTER.woCode,
      csWoCode:FILTER.csWoCode,
      person:$rootScope.userInfo.userName
    };
    //确认抢单
    vm.confirm = function () {
      vm.requesting=true;
      CustomerService.DealOrder(vm.handle.woCode,vm.dealer,vm.dealername)
          .then(function () {
            $uibModalInstance.close();
          })
          .catch(function (err) {
            vm.requesting=false;
            $rootScope.catchError(err);
          })
    };
  }

})();
