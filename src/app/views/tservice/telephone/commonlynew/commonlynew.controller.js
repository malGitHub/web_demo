
/**
 * Created by zhaosp on 2016/10/31.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceTelephoneCommonlynewController', TserviceTelephoneCommonlynewController);
  function TserviceTelephoneCommonlynewController($uibModalInstance,$scope,TelephoneService,TbossService,$rootScope,Message) {

    var vm = this;
    vm.title="新增";
    vm.data = {
      carType:'',
      tel:'',
      name:'',
      type:'1',
      carTypeName:''
    };
    vm.closeEdit = function (){
      $uibModalInstance.dismiss();
    };

      vm.array = {
        type:'A',
        code:'A010'

    };
    /*
    * 全部车系
    * */
    vm.choiceSelect=function () {
      if(vm.carType[0]==1&&vm.carType.length>1){
        Message.confirm('不支持该操作')
          .then(function () {
            vm.carType.splice(0,1);
          });
      }else if(vm.carType[vm.carType.length-1]==0&&vm.carType.length>1){
        Message.confirm('不支持该操作')
          .then(function () {
            vm.carType.splice(vm.carType.length-1,1);
          });
      }
    };

    /**
     * 车型查询
     */

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

    /**
     *紧急电话常用新增接口
     * @param evt
     * @param form
     */



    vm.submit = function (evt, form) {
      evt.preventDefault();
      vm.carTypeName=[];
      for(var i=0;i<vm.carType.length;i++){
        for(var k=0;k<vm.CAR_TYPE.length;k++){
          if(vm.carType[i]==vm.CAR_TYPE[k].seriseId){
            vm.carTypeName.push(vm.CAR_TYPE[k].seriseName);
            break;
          }
        }
      }
      vm.data.carType=vm.carType.join(",");//数组元素用逗号','分开
      vm.data.carTypeName=vm.carTypeName.join(",");//数组元素用逗号','分开
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


  }

})();


