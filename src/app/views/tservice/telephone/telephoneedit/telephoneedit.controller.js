
/**
 * Created by zhaosp on 2016/10/31.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceTelephoneTelephoneeditController', TserviceTelephoneTelephoneeditController);
  function TserviceTelephoneTelephoneeditController($rootScope,$uibModalInstance,TelephoneService,TbossService,Message,id,tel,name,image) {
    var vm = this;
    vm.title = "编辑";
    vm.data = {
     id:id,
      name: name,
      tel: tel,
      type: '3',
      imgPath: image
    };
    if(image!=''){
      vm.hasImg=true;
    }else{
      vm.hasImg=false;
    }
    vm.closeEdit = function () {
      $uibModalInstance.dismiss();
    };


    vm.submit = function (evt, form) {
      evt.preventDefault();
      //  vm.query.items=vm.itemsArry.join(",");//数组元素用逗号','分开
      if (form.$valid && !vm.requesting) {
        vm.requesting = true;
        TelephoneService.updTelephoneList(vm.data)
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
    vm.uploadImg = function () {
      if(!vm.file){
        alert("请选择上传的图片")
      }else if(vm.file.type.split("/")[0]!='image'){
        alert("只允许上传图片")
      }else{
        TbossService.importDevicesImg(vm.file,$rootScope.userInfo.userId)
          .then(function (data) {
             vm.data.imgPath=data.data[1].fullPath;
            vm.hasImg=true;
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          });
        vm.file = null;
      }

    };


  }






})();

