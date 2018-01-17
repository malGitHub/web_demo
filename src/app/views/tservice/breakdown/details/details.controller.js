(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceBreakdownDetailsController', TserviceBreakdownDetailsController);
    function TserviceBreakdownDetailsController($uibModalInstance,TbossService, Message,faultid,faulttime,$rootScope) {
        var vm = this;
        vm.title="详情";
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
        function getForm(){
            var time=faulttime.split(' ')[0];
           TbossService.QueryFaultRecordDetail(faultid,time)
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
    }

})();
