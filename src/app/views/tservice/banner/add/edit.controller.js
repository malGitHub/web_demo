
/**
 * Created by zhaosp on 2016/10/31.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceBannerEditController', TserviceBannerEditController);
  function TserviceBannerEditController($rootScope,$uibModalInstance,BannerService,TbossService,params,from) {
    var vm = this;
    vm.title = "编辑";
    vm.data = {
      bannerType:params.bannerType,
      name:params.bannerName,
      type:from=='司机版'?'2':'1',
      imgPath: params.imgPath,
      bannerLink:params.bannerLink,
      id:params.id
    };


    vm.from=from=='1'?'车队版':'司机版';

    vm.style=[{key:'1',value:'链接'}];

    if(params.imgPath!=''){
      vm.hasImg=true;
    }else{
      vm.hasImg=false;
    }
    vm.closeEdit = function () {
      $uibModalInstance.dismiss();
    };


    vm.submit = function (evt, form) {
      evt.preventDefault();
      if (form.$valid && !vm.requesting) {
        vm.requesting = true;
        BannerService.UpdateBannerInfo(vm.data)
          .then(function () {
            $uibModalInstance.close(from);
            vm.requesting = false;
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          })

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
             vm.data.imgPath=data.data[0].fullPath;
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

