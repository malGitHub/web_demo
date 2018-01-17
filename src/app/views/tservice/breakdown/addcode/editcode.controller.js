(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceBreakdownEditcodeController', TserviceBreakdownEditcodeController);
    function TserviceBreakdownEditcodeController($rootScope,$uibModalInstance,TbossService, Message,FaultCode) {
        var vm = this;
        vm.title="编辑";
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
        function getForm(){
            TbossService.QueryDetailFaultBase(FaultCode)
                .then(function (data) {
                     vm.query=data;
                })
                .catch(function (err) {
                    $rootScope.catchError(err);
                })
                .then(function () {
                    vm.requesting = false;
                });
        }
        getForm();
        vm.submit = function (evt, form) {
            evt.preventDefault();
            if (form.$valid && !vm.requesting) {
                vm.requesting = true;
                TbossService.UpdateFaultBase(FaultCode,vm.query,$rootScope.userInfo.userId)
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
