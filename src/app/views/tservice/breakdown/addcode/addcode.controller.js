(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceBreakdownAddcodeController', TserviceBreakdownAddcodeController);
    function TserviceBreakdownAddcodeController($rootScope,$uibModalInstance,TbossService) {
        var vm = this;
        vm.title="新增";
        vm.query={
            faultCode:'',
            faultType:'',
            faultDesc	:'',
            faultLevel:'',
            faultReason:'',
            faultSolution:'',
            faultECU:'',
            userId:$rootScope.userInfo.userId
        };
        vm.requesting=false;
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        vm.submit = function (evt, form) {
            evt.preventDefault();
            if (form.$valid && !vm.requesting) {
                vm.requesting = true;
                TbossService.AddFaultBase(vm.query)
                    .then(function () {
                        $uibModalInstance.close();
                    })
                    .catch(function (err) {
                      vm.requesting = false;
                      $rootScope.catchError(err);
                    })
            }
        };

    }

})();
