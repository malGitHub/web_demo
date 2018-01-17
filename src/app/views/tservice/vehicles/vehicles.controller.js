/**
 * Created by Administrator on 2017/3/6.
 */

(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceVehiclesController', TserviceVehiclesController);

  /** @ngInject */
  function TserviceVehiclesController($rootScope,VehicleService,TbossService) {
    var vm = this;
    vm.nowDate=new Date();
     vm.query={
      syStartDate:"",
      syEndDate:"",
      series:"",
      model:"",
      keyWord:""
    };
    vm.page_number=1;
    vm.page_size=10;

     //高级筛选控制开关
    vm.highcontrol = false;
    vm.choosemore = function () {
      vm.highcontrol = !vm.highcontrol;
    };
    //排序
    vm.controlSort=false;
    vm.type=1;
     vm.orderCheck = function () {
      vm.controlSort=!vm.controlSort;
      if(vm.controlSort){
        vm.type=0;
      }else {
        vm.type=1;
      }
      vm.carInfoList();
        return vm.sortType;
    };
 


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
          vm.CAR_SERIES=data;
        })
        .catch(function (err) {
          $rootScope.messageError (err, '车型信息获取失败，请稍后重试');
        });
    }

    //车系下拉框选择操作
    vm.changeSeries=function(){
      vm.query.model='';
      vm.CAR_Model=[];
      if(vm.query.series=='' || vm.query.series==null){
        vm.carInfoList();
        return;
      }
       TbossService.getModelList_activity(vm.query.series)
        .then(function (data) {
          vm.CAR_Model=data;
          vm.carInfoList();
        })
        .catch(function (err) {
          $rootScope.messageError (err, '车型信息获取失败，请稍后重试');
        });

    };
    vm.changeModel=function(){
      vm.carInfoList();
    };

     //车辆信息列表查询
    vm.carInfoList =function (){
      VehicleService.vehicleCarInfoList(vm.type,vm.page_number,vm.page_size,vm.query)
        .then(function(data){
          vm.total = data.total;
           vm.vehicleList = data.list;
        })
        .catch(function(err){
          $rootScope.catchError(err);
        })

    };
    vm.carInfoList();
    //分页
    vm.flip= function (page_number) {
      vm.page_number = page_number;
      //调用会话列表接口
      vm.carInfoList();
    };

  }
})();

