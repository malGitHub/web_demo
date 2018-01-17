/**
 * Created by wurui on 2016/10/31.
 */
(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceBuildnewWocodeController', TserviceBuildnewWocodeController);
    function TserviceBuildnewWocodeController($uibModalInstance,$state,Code,myParams) {
        var vm = this;
        vm.codes=Code;
        vm.title="当前车辆在该服务站已有进行中单：";
        vm.closeEdit = function () {
            $uibModalInstance.dismiss();
        };
        vm.clickcode=function (c) {
          myParams.set({"nature":4});
          $uibModalInstance.dismiss();
        }
    }
})();
