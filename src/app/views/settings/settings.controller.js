(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('SettingsController', SettingsController);

    /** @ngInject */
    function SettingsController($uibModalInstance,$rootScope,SsoService, Message) {
        var vm = this;
        vm.oldPwd = '';
        vm.newPwd = '';
        vm.confirmPwd = '';
        vm.resetPassword = function () {
          if (vm.oldPwd != ''&&vm.newPwd!=''&vm.confirmPwd!='') {
            if (vm.oldPwd == vm.newPwd) {
              Message.error('原始密码与新密码不能相同');
            } else {
              if (vm.newPwd == vm.confirmPwd) {
                SsoService.resetPassword(vm.oldPwd,vm.newPwd,vm.confirmPwd).then(function(){
                  Message.success('密码修改成功');
                  $uibModalInstance.close();
                  $rootScope.logout();
                },function (error) {
                  $rootScope.catchError(error);
                })
              } else {
                Message.error('确认新密码与新密码不相同');
              }
            }
          } else {
            Message.error('表单项不能为空');
          }
        }

      vm.cancel = function () {
        $uibModalInstance.dismiss();
      };
    }
})();
