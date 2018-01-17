/**
 * Created by wurui on 2016/10/31.
 */
(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceCareCarebackController', TserviceCareCarebackController);
    function TserviceCareCarebackController($uibModalInstance) {
        var vm = this;
        vm.title="编辑";
        vm.closeEdit = function () {
            $uibModalInstance.dismiss();
        };
    }

})();