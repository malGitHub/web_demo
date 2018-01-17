(function () {
  'use strict';

  angular.module('WeViews')
    .controller('TserviceMessagechitaddImportController', TserviceMessagechitaddImportController);

  function TserviceMessagechitaddImportController($timeout,$rootScope,$uibModalInstance, TbossService, Message,title,content,userPhoneNumbers) {
    var vm = this;
    vm.file = null;
    vm.cancel = function () {
      $uibModalInstance.dismiss();
    };
    vm.userId=$rootScope.userInfo.userId;
    vm.submit = function (evt) {
      evt.preventDefault();
      if(vm.file.name.match(/\.(\w+)$/)[1]!="xlsx" && vm.file.name.match(/\.(\w+)$/)[1]!="xls"){
        alert("上传文件格式不正确，请下载模板")
      }else{
        TbossService.importDevices(vm.file,vm.userId)
          .then(function (data) {
            Message.success('正在导入，请稍后');
            $timeout(function() {
              fileUpload();
            },7000);
            function fileUpload() {
              TbossService.PhoneNoFileUpload(data.data.fullPath,data.data.ext_name,title,content,userPhoneNumbers.join(','))
                .then(function (data) {
                  $uibModalInstance.close(data);
                })
                .catch(function () {
                  $timeout(function() {
                    TbossService.PhoneNoFileUpload(data.data.fullPath,data.data.ext_name,title,content,userPhoneNumbers.join(','))
                      .then(function (data) {
                        $uibModalInstance.close(data);
                      }).catch(function (err) {
                      Message.error(err.message);
                      $uibModalInstance.dismiss();
                    })
                  },2000);

                });
            }
            })
          .catch(function (err) {
            $rootScope.messageError (err,'获取文件失败，请重新上传');
            $uibModalInstance.dismiss();
          });
        vm.file = null;
      }

    };
  }
})();
