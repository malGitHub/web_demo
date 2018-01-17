/**
 * Created by wurui on 2016/10/31.
 */
(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceUpkeepUpkeepitemaddController', TserviceUpkeepUpkeepitemaddController);
    function TserviceUpkeepUpkeepitemaddController($rootScope,$uibModalInstance,TbossService,Message,maintainItemId,maintainItemName) {
        var vm = this;
        vm.title="编辑";
        vm.closeEdit = function () {
            $uibModalInstance.dismiss();
        };
        vm.itembaoyang="";
        vm.requesting = false;
        vm.maintainItemName=maintainItemName;
        vm.submit = function (evt, form) {
            evt.preventDefault();
            if (form.$valid && !vm.requesting) {
                vm.requesting = true;
                TbossService.UpdateMaintainItem(maintainItemId,vm.maintainItemName,$rootScope.userInfo.userId)
                    .then(function () {
                        $uibModalInstance.close();
                        vm.maintainItemName="";
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
