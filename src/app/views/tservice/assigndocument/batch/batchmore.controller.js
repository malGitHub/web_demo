
(function () {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceAssigndocumentBatchmoreController', TserviceAssigndocumentBatchmoreController);
  function TserviceAssigndocumentBatchmoreController($uibModalInstance,$rootScope,Message,CustomerService,woIds) {
    var vm = this;
    vm.requesting = false;
    vm.closeEdit = function () {
      $uibModalInstance.dismiss();
    };
    vm.changesite=function () {
      dealerMiss(vm.dealer.userId);
    };
    vm.rootdealer=$rootScope.userInfo.userId;
    vm.submit = function (evt, form) {
      evt.preventDefault();
      if (form.$valid && !vm.requesting) {
        vm.requesting = true;
        CustomerService.Distribute(woIds,vm.dealer.userId,vm.dealer.userName)
          .then(function () {
            $uibModalInstance.close();
          })
          .catch(function (err) {
            vm.requesting = false;
            $rootScope.catchError(err);
          })
      }
    };
    //获取处理人列表
    function getDealer(dealer){
      CustomerService.QueryWoProcessor(dealer)
        .then(function (data) {
          vm.sites=data;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }
    getDealer(vm.rootdealer);

    //当前处理人工单数
    function dealerMiss(id) {
      CustomerService.GetWoCnt(id)
        .then(function (data) {
          vm.dealerNum=data[0].processCnt;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }
  }

})();
