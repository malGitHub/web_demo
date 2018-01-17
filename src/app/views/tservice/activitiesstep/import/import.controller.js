(function () {
  'use strict';

  angular.module('WeViews')
    .controller('TserviceActivitiesstepImportController', TserviceActivitiesstepImportController);

  function TserviceActivitiesstepImportController($rootScope,$uibModalInstance,TbossService, ActivityListService,id,carChassisNumList, Message,$timeout) {
    var vm = this;
    vm.file = null;
    vm.cancel = function () {
      $uibModalInstance.dismiss();
    };
     vm.userId=$rootScope.userInfo.userId;
    vm.store=[];
    for(var i=0;i<carChassisNumList.length;i++) {
       vm.store.push(carChassisNumList[i].chassisNum);
     }
      vm.submit = function (evt) {
      evt.preventDefault();
      if(vm.file.name.match(/\.(\w+)$/)[1]!="xlsx" && vm.file.name.match(/\.(\w+)$/)[1]!="xls"){
        alert("上传文件格式不正确，请下载模板")
      }else{
        TbossService.importDevices(vm.file,vm.userId)
          .then(function (data) {
            Message.success('正在导入，请稍后');
            $timeout(function() {
              fileUpload(data);
            },7000);
            })
          .catch(function (err) {
            $rootScope.messageError (err,'获取文件失败，请重新上传');
            $uibModalInstance.dismiss();
          });
        vm.file = null;
      }

    };
    function fileUpload(data) {
      var strings=vm.store.join(',');
      ActivityListService.carChassisNumUpload(data.data.fullPath,data.data.ext_name,id,strings)
        .then(function (data) {
          $uibModalInstance.close(data);
        })
        .catch(function (err) {
          if(err.resultCode==507){
            Message.error(err.message);
            $uibModalInstance.dismiss();
           }else if(err.resultCode==500){
            $timeout(function() {
              ActivityListService.carChassisNumUpload(data.data.fullPath,data.data.ext_name,id,strings)
                .then(function (data) {
                   $uibModalInstance.close(data);
                }).catch(function (err) {
                if(err.resultCode==507){
                  Message.error(err.message);
                 }else {
                  $rootScope.messageError(err,'导入失败');
                 }
                $uibModalInstance.dismiss();
              });
            },2000)
          }else {
            $rootScope.messageError(err,'导入失败');
            $uibModalInstance.dismiss();
           }

         });

    }
  }
})();
