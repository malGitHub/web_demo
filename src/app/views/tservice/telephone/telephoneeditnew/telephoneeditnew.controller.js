
/**
 * Created by zhaosp on 2016/10/31.
 */
(function() {
  'use strict';
  angular
    .module('WeViews')
    .controller('TserviceTelephoneTelephoneeditnewController', TserviceTelephoneTelephoneeditnewController);
  function TserviceTelephoneTelephoneeditnewController($rootScope,$uibModalInstance,TelephoneService,Message,TbossService) {
    var vm = this;
    vm.title="新增";
    vm.closeEdit = function (){
      $uibModalInstance.dismiss();
    };
    vm.hasImg=false;
    vm.requesting=false;
    /**
     * 保险公司新增
     * @param evt
     * @param form
     */
    vm.data = {
      carType:'',
      tel:'',
      name:'',
      type:'3',
      imgPath: ''
    };
    vm.submit = function (evt, form) {
      evt.preventDefault();
      // vm.query.items=vm.itemsArry;//数组元素用逗号','分开
      if (form.$valid && !vm.requesting) {
        vm.requesting = true;
        TelephoneService.addTelephoneBaseList(vm.data)
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
      }else {
        TbossService.importDevicesImg(vm.file, $rootScope.userInfo.userId)
          .then(function (data) {
            vm.data.imgPath = data.data[1].fullPath;
            vm.hasImg = true;
          })
          .catch(function (err) {
            vm.requesting = false;
            $rootScope.catchError(err);
          });
        vm.file = null;
      }
    };
  }

})();


