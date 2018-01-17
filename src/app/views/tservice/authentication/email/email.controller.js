/**
 * Created by wurui on 2016/10/31.
 */
(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceAuthenticationEmailController', TserviceAuthenticationEmailController);
    function TserviceAuthenticationEmailController($rootScope,$uibModalInstance,Message,AuthenticationService,pageIndex, pageSize, query) {
        var vm = this;
        vm.title="请输入接收邮箱";
        vm.closeEdit = function () {
            $uibModalInstance.dismiss();
        };
        vm.requesting = false;
        vm.submit = function (evt, form) {
            evt.preventDefault();
            if (form.$valid && !vm.requesting) {
                vm.requesting = true;
              AuthenticationService.getExcelManual(vm.email,pageIndex,pageSize,query)
                .then(function () {
                        $uibModalInstance.close();
                        Message.success("操作成功")
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
