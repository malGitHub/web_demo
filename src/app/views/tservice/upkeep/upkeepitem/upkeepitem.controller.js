/**
 * Created by wurui on 2016/10/31.
 */
(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceUpkeepUpkeepitemController', TserviceUpkeepUpkeepitemController);
    function TserviceUpkeepUpkeepitemController($rootScope,$uibModalInstance,TbossService) {
        var vm = this;
        vm.title="新增";
        vm.closeEdit = function () {
            $uibModalInstance.dismiss();
        };
        vm.itembaoyang="";
        vm.requesting = false;
        vm.submit = function (evt, form) {
            evt.preventDefault();
            if (form.$valid && !vm.requesting) {
                vm.requesting = true;
                TbossService.addMaintainItemList(vm.maintainItemName,$rootScope.userInfo.userId)
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
