
/**
 * Created by zhaosp on 2016/10/31.
 */
(function() {
  'use strict';
  angular
    .module('WeViews')
    .controller('TserviceBannerAddController', TserviceBannerAddController);
  function TserviceBannerAddController($rootScope,$uibModalInstance,BannerService,from,TbossService) {
    var vm = this;
    vm.title="新建banner";
    vm.closeEdit = function (){
      $uibModalInstance.dismiss();
    };
    vm.style=[{key:'1',value:'链接'}];
    vm.from=(from=='1'?'车队版':'司机版');
    vm.hasImg=false;
    vm.requesting=false;

    vm.data = {
      bannerType:'',
      name:'',
      type:from,
      imgPath: '',
      bannerLink:''
    };
    vm.submit = function (evt, form) {
      evt.preventDefault();
      if (form.$valid && !vm.requesting) {
        vm.requesting = true;
        BannerService.AddBannerInfo(vm.data)
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
      }else {
        TbossService.importDevicesImg(vm.file, $rootScope.userInfo.userId)
          .then(function (data) {
            vm.data.imgPath = data.data[0].fullPath;
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


