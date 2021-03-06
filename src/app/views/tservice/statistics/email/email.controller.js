/**
 * Created by wurui on 2016/10/31.
 */
(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceStatisticsEmailController', TserviceStatisticsEmailController);
    function TserviceStatisticsEmailController($rootScope,$uibModalInstance,Message,CustomerService,query) {
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
              CustomerService.AnalysisStagesExport(vm.email, query)
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
