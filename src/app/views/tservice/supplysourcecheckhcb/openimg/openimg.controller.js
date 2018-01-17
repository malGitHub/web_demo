(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceSupplysourcecheckhcbOpenimgController', TserviceSupplysourcecheckhcbOpenimgController);
    function TserviceSupplysourcecheckhcbOpenimgController($uibModalInstance,filter) {
        var vm = this;
        vm.title="查看图片";
         vm.closeEdit = function () {
            $uibModalInstance.dismiss();
        };
        vm.imgsrc=filter;
      }
})();
