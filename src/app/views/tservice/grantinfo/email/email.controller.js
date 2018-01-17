/**
 * Created by wurui on 2016/10/31.
 */
(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceGrantinfoEmailController', TserviceGrantinfoEmailController);
    function TserviceGrantinfoEmailController($rootScope,$uibModalInstance,Message,GrantService,sendQuantitySort,restQuantitySort,id,inputText,grantStartTime,grantEndTime,provinceId,cityId,pageIndex,pageSize) {
        var vm = this;
        vm.title="请输入接收邮箱";
        vm.closeEdit = function () {
            $uibModalInstance.dismiss();
        };
        vm.requesting = false;
        vm.submit = function (evt, form) {
            evt.preventDefault();
            if (form.$valid && !vm.requesting) {
                vm.requesting = true;
              GrantService.getExeclLinkNext(vm.email,sendQuantitySort,restQuantitySort,id,inputText,grantStartTime,grantEndTime,provinceId,cityId,pageIndex,pageSize)
                .then(function () {
                        $uibModalInstance.close();
                        Message.success("操作成功")
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
