
/**
 * Created by zhaosp on 2016/10/31.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceTelephoneCommonlyController', TserviceTelephoneCommonlyController);
  function TserviceTelephoneCommonlyController($uibModalInstance,TelephoneService,TbossService,id,name,tel,carType,$rootScope){

    console.log(carType);
    var vm = this;
    vm.title="编辑";
    vm.data = {
      id:id,
      name:name,
      tel:tel,
      type:'1',
      carType:carType,
      imgPath:'123456'
    };
    vm.closeEdit = function (){

      $uibModalInstance.dismiss();
    };
    /**
     * 提交
     * @param evt
     * @param form
     */

    vm.submit = function (evt,form) {
      evt.preventDefault();

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


    vm.array = {
      type:'A',
      code:'A010'
    };


   /* function getCAR_CHOICE(){

      TelephoneService.getBrandList(vm.array)
        .then(function (data) {
          vm.CAR_TYPE=data.list;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }
    getCAR_CHOICE();*/


    vm.CAR_TYPE=[{seriseId:1,seriseName:'全部车系'}];
    vm.CAR_Default=[{seriseId:0,seriseName:'默认'}];

    //获取品牌
    TbossService.getBrandList()
      .then(function (data) {
        getCAR_SERVICE(data[0].brandId);
      })
      .catch(function (err) {
        $rootScope.messageError (err, '获取车辆品牌信息失败，请稍后重试');
      });
    //获取车系
    function getCAR_SERVICE(brandId){
      TbossService.getSeriseList(brandId)
        .then(function (data) {
          vm.CAR_TYPE=vm.CAR_TYPE.concat(data);
          vm.CAR_TYPE=vm.CAR_TYPE.concat(vm.CAR_Default);
        })
        .catch(function (err) {
          $rootScope.messageError (err, '车型信息获取失败，请稍后重试');
        });
    }
  }

})();


