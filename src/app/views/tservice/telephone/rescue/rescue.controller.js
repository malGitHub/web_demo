
/**
 * Created by zhaosp on 2016/10/31.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceTelephoneRescueController', TserviceTelephoneRescueController);
  function TserviceTelephoneRescueController($uibModalInstance,TelephoneService,Message,id,tel,name,$rootScope) {
    var vm = this;
    vm.title="编辑";
    vm.data = {
      id:id,
      name:name,
      tel:tel,
      imgPath:'567890',
      type:'2'

    }
    vm.closeEdit = function (){
      $uibModalInstance.dismiss();
    };

    vm.submit = function (evt, form) {
      evt.preventDefault();
      //  vm.query.items=vm.itemsArry.join(",");//数组元素用逗号','分开
      if (form.$valid && !vm.requesting) {
        vm.requesting = true;
        TelephoneService.updTelephoneList(vm.data)
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
    };














  }

})();

