(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceSubscribeRepairaddController', TserviceSubscribeRepairaddController);
    function TserviceSubscribeRepairaddController($uibModalInstance,SubscribeService, Message,$rootScope) {
        var vm = this;
        vm.title="新增";
        vm.content = "";
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        vm.query = {
            itemName:"",
            type:"1"
        }


        /**
         *  表单提交方法
         * @param evt
         * @param form
         */
        vm.submit = function (evt, form) {
            evt.preventDefault();
            if (form.$valid && !vm.requesting) {
                vm.requesting = true;
                SubscribeService.addSubscribeItem(vm.query)
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
