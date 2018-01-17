/**
 * Created by wurui on 2016/12/15.
 */
(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceDealorderviewOpenimgController', TserviceDealorderviewOpenimgController);
    function TserviceDealorderviewOpenimgController($uibModalInstance,filter,index) {
        var vm = this;
        vm.title="查看图片";
        vm.closeEdit = function () {
            $uibModalInstance.dismiss();
        };
        vm.imgsrc=filter[index]
    }
})();
