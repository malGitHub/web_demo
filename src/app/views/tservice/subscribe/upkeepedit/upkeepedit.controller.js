(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceSubscribeUpkeepeditController', TserviceSubscribeUpkeepeditController);
    function TserviceSubscribeUpkeepeditController($uibModalInstance,SubscribeService, Message,maintainObj,$rootScope) {
        var vm = this;
        vm.title="编辑";
        vm.query = {
            itemId:"",
            itemName:""
        };
        vm.query.itemName = maintainObj.itemName;
        vm.query.itemId = maintainObj.itemId;

        /**
         *  表单提交方法
         * @param evt
         * @param form
         */
        vm.submit = function (evt, form) {
            evt.preventDefault();
            if (form.$valid && !vm.requesting) {
                vm.requesting = true;
                SubscribeService.updateSubscribeItem(vm.query)
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


        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }
})();
