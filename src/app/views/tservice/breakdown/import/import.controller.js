(function () {
  'use strict';

  angular.module('WeViews')
    .controller('TserviceBreakdownImportController', TserviceBreakdownImportController);

  function TserviceBreakdownImportController($http,$rootScope,$uibModalInstance, TbossService, Message) {
    var vm = this;
    vm.file = null;
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    vm.userId=$rootScope.userInfo.userId;
    vm.submit = function (evt) {
      evt.preventDefault();
      if(vm.file.name.match(/\.(\w+)$/)[1]!="xlsx"){
        alert("上传文件格式不正确，请下载模板")
      }else{
        TbossService.importDevices(vm.file,vm.userId)
          .then(function (data) {
            TbossService.ImpFaultCode(data.data.fullPath,data.data.ext_name,vm.userId)
              .then(function () {
                $uibModalInstance.dismiss();
              })
              .catch(function (err) {
                Message.error(err);
              });
          })
          .catch(function (err) {
            Message.error(err)
          });
        vm.file = null;
      }

    };
  }
})();
