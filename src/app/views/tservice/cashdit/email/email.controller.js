/**
 * Created by wurui on 2016/10/31.
 */
(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceCashditEmailController', TserviceCashditEmailController);
    function TserviceCashditEmailController($rootScope,$uibModalInstance,Message,CashService,exchangeQuantitySort,restQuantitySort,id,inputText,exchangeQuotaSmall,exchangeQuotaBig,provinceId,cityId,pageIndex,pageSize) {
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
                CashService.getExeclLink(vm.email,exchangeQuantitySort,restQuantitySort,id,inputText,exchangeQuotaSmall,exchangeQuotaBig,provinceId,cityId,pageIndex,pageSize)
                .then(function (){
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
