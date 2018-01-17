(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceSupplysourcecheckOpenimgController', TserviceSupplysourcecheckOpenimgController);
    function TserviceSupplysourcecheckOpenimgController($uibModalInstance,filter) {
        var vm = this;
        vm.title="查看图片";
         vm.closeEdit = function () {
            $uibModalInstance.dismiss();
        };
        vm.imgsrc=filter;
      }
})();
