(function () {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceCloseController', TserviceCloseController);


  /** @ngInject */
  function TserviceCloseController($rootScope,$timeout,myParams,$uibModal,$window,ActivityService, PublicService,GetTemplateUrl, GetControllerName, Message,CustomerService) {

    var vm = this;
    //分页
    vm.pageIndex = 1;
    vm.pageSize =10;
    vm.flip = function (pageIndex) {
      vm.pageIndex = pageIndex;
      getList();
    };
    myParams.set({"nature":3});
    //当前状态
    vm.closeType=[
      {key:"9",value:"申请取消"},{key:"10",value:"取消服务"},{key:'11',value:"系统关闭"}
    ];
    //申请关闭前状态
    vm.applyNoCloseType=[
      {key:"1",value:"待分派"},{key:"2",value:"待接车"},{key:"3",value:"检查中"},{key:'4',value:"维修中"},{key:'5',value:"完成待确认"},{key:'6',value:"待出站"}
    ];
    //状态下拉选择
    vm.selectChange=function(){
      getList();
    };
    //关闭弹窗
    vm.closeEdit = function () {
      $uibModalInstance.dismiss();
    };
    vm.advSearch = function () {
      vm.pageIndex = 1;
      getList();
    };
    /*本地时间*/
    var setTime = Date.parse("2017/01/01 00:00");
    vm.startTime = new Date(setTime);
    vm.onTimeFilterStart=function () {
      vm.pageIndex=1;
      getList();
    };
    vm.onTimeFilterEnd=function () {
      vm.pageIndex=1;
      getList();
    };
    vm.serviceType="";
    PublicService.basedata('A','A052')
      .then(function (data) {
        vm.FUWU_TYPE =data.list;
      }).catch(function (err) {
      $rootScope.catchError(err);
    });

  //省份下拉框选择操作
    getProvince();
    function getProvince(){
      ActivityService.getAreaList()
        .then(function (data) {
          vm.AreaList=data;
        })
        .catch(function (err) {
          $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
        });
    }
    //省份选择操作
    vm.changeProvince=function(){

      if(vm.provinceId != '' && vm.provinceId != null) {
        //获取第二个下拉框（城市）
        ActivityService.getAreaList(vm.provinceId)
          .then(function (data) {
            getList();
            vm.CityList = data;
            vm.StoreList = [];
          })
          .catch(function (err) {
            $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
          });
      }else{
        vm.StoreList = [];
        vm.CityList = [];
        vm.cityId='';
        vm.storeId = '';
        getList();
      }
    };


    //城市下拉框选择操作
    vm.changeCity=function(){
      vm.StoreList=[];
      if(vm.provinceId != '' && vm.provinceId != null) {
        getStoreList();
      }
      getList();
    };

    //服务站下拉框选择操作
    function getStoreList(){
      if(vm.cityId!= '' && vm.cityId != null) {
        //获取网点下拉框
        ActivityService.getStoreList(vm.provinceId, vm.cityId, '2')
          .then(function (data) {
            vm.StoreList = data;
          })
          .catch(function (err) {
            $rootScope.messageError(err, '获取网点信息失败，请稍后重试');
          });
        getList();
      }else {
        vm.StoreList = [];
        vm.storeId = '';
        getList();
      }
     }
    vm.changeStore = function(){
      if(vm.storeId != null  && vm.storeId != ''){
        for(var i=0;i<vm.StoreList.length;i++){
          if(vm.storeId == vm.StoreList[i].stationId){
            vm.storeType = vm.StoreList[i].storeType;
            break;
          }
        }
      }
      getList();
    };

    //服务用时
    vm.FUWU_TIME = [
      {value: '1', name: '＜24小时'},
      {value: '2', name: '≥24小时'},
      {value: '3', name: '≥48小时'},
      {value: '4', name: '≥72小时'}
    ];
    //服务用时
    vm.servicesTime=function(){
      getList();
    };
    //审核
    vm.toCheck = function (obj) {
      $uibModal.open({
        templateUrl: GetTemplateUrl('tservice.close.check'),
        controller: GetControllerName('tservice.close.check'),
        controllerAs: 'vm',
        windowClass: '',
        resolve: {
          filter:function () {return obj;}
        },
        backdrop: false
      })
      .result.then(function () {//回传到父级页面
        getList();
         Message.success('操作成功！');
      });
    };

    //模糊查询
    vm.onSearch = function () {
      getList();
    };
    //获取当前使用者userId
     vm.userId=$rootScope.userInfo.userId;
    //vm.userId='1';
    //获取列表
     function getList() {
      CustomerService.CloseOrder(vm.userId,vm.orderStatus,vm.beforeOrderStatus,vm.keyword,vm.pageIndex,vm.pageSize,vm.provinceId,vm.cityId,vm.storeId,vm.serviceTime,vm.applyDateStart,vm.applyDateEnd)
        .then(function (data) {
          vm.total=data.total;
          vm.list=data.list;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }
    getList();
    /*导出*/
    vm.getExecl=function () {
      var email='';
      var filter={
        userId:vm.userId,
        orderStatus:vm.orderStatus,
        beforeOrderStatus:vm.beforeOrderStatus,
        keyword:vm.keyword,
        page_number:vm.pageIndex,
        page_size:vm.pageSize,
        provinceId:vm.provinceId,
        cityId:vm.cityId,
        stationId:vm.storeId,
        serviceTime:vm.serviceTime,
        startDate:vm.applyDateStart,
        endDate:vm.applyDateEnd
      };
      CustomerService.exportCloseOrderList(email,filter)
        .then(function(data){
           //window.open(data);
          Message.success("正在导出，请稍后");
          $timeout(function() {
            $window.location.href=data;
          },1000*10);
        })
        .catch(function(err){
          if(err.resultCode==530){
            $uibModal.open({
              templateUrl: GetTemplateUrl('tservice.close.email'),
              controller: GetControllerName('tservice.close.email'),
              controllerAs: 'vm',
              backdrop: false,
              resolve: {
                filter: function () {
                  return filter;
                }
              }
            })
          }else{
            $rootScope.catchError(err);
          }
        })
    }
  }
})
();

