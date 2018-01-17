/**
 * Created by wurui on 2016/10/31.
 */
(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceAssigndocumentEmailController', TserviceAssigndocumentEmailController);
    function TserviceAssigndocumentEmailController($rootScope,$uibModalInstance,Message,CustomerService,filters,query) {
        var vm = this;
        vm.title="请输入接收邮箱";
        vm.closeEdit = function () {
            $uibModalInstance.dismiss();
        };
        vm.email='';
        vm.requesting = false;
        vm.submit = function (evt, form) {
            evt.preventDefault();
            if (form.$valid && !vm.requesting) {
                vm.requesting = true;
              CustomerService.getExeclLink(vm.email,query,filters)
                .then(function () {
                        $uibModalInstance.close();
                        Message.success("发送成功")
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
