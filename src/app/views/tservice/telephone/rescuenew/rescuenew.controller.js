
/**
 * Created by zhaosp on 2016/10/31.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceTelephoneRescuenewController', TserviceTelephoneRescuenewController);
  function TserviceTelephoneRescuenewController($uibModalInstance, TelephoneService,Message,$rootScope) {
    var vm = this;
    vm.title = "新增";
    vm.data = {
      tel: '',
      name: '',
      type: '2'
    }
    vm.closeEdit = function () {
      $uibModalInstance.dismiss();
    };



  vm.submit = function (evt, form) {
    // alert(JSON.stringify(vm.data))
    evt.preventDefault();
    // vm.query.items=vm.itemsArry;//数组元素用逗号','分开
    if (form.$valid && !vm.requesting) {
      vm.requesting = true;
      TelephoneService.addTelephoneBaseList(vm.data)
        .then(function () {
           $uibModalInstance.close();
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        })
        .then(function () {
          vm.requesting = false;
        });
    }
  }
  }
})();


