/**
 * 工单处理主页面控制类
 * @Author zhaoming@mapbar.com
 * @Date 2016/11/15 9:26
 */
(function () {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceDealorderController', TserviceDealorderController);

  /** @ngInject */
  function TserviceDealorderController($interval,$uibModal,$timeout,Message,myParams,ActivityService,$state,$window, GetTemplateUrl,$rootScope, GetControllerName, DealorderService,PublicService) {

    var vm = this;
    //每分钟刷新列表
    $rootScope.DealorderInterval = $interval(function () {
      getWorkOrderList2();
    }, 1000 * 60 *1);
    myParams.set({"nature":2});
    vm.userId = $rootScope.userInfo.userId;
    vm.moreobject = false;
    vm.pageIndex = 1;
    vm.pageSize = 10;
    vm.sendMsgData = {};

    vm.query = {
      keyword: "",
      orderType:"",
      orderStatus:"",
      satisfaction:"",
      operatorId:"",
      dateType:"",
      createTimeStart:"",
      createTimeEnd:""
    };

    //工单类型
    vm.ORDER_TYPE = [
      {val: '1', name: '进出站'},
      {val: '2', name: '外出救援'}
    ];

    //工单状态
    vm.ORDER_STATE = [
      {val: '1', name: '待分派'},
      {val: '2', name: '待接车'},
      {val: '3', name: '检查中'},
      {val: '4', name: '维修中'},
      {val: '5', name: '完成待确认'},
      {val: '6', name: '待出站'},
      {val: '7', name: '已出站'},
      {val: '8', name: '取消预约'},
      {val: '9', name: '申请取消'},
      {val: '10', name: '取消服务'},
      {val: '11', name: '系统关闭'}
    ];

    //预约类型
    vm.SUBSCRIBE_TYPE = [
      {val: '1', name: '400电话'},
      {val: '2', name: 'APP预约'},
      {val: '3', name: '自主进站'}


    ];
    //服务类型
    vm.SERVICE_TYPE = [
      {val: '1', name: '检查阶段'},
      {val: '2', name: '维修阶段'}

    ];
    getProvince();
    function getProvince(){
      ActivityService.getAreaList()
        .then(function (data) {
          vm.AreaList=data;
        })
        .catch(function (err) {
          $rootScope.messageError (err, '获取省市下拉失败，请稍后重试');
        });
    }
    //一级服务类型下拉框选择操作
    vm.changeFirstServices=function(){
      vm.serviceType='';
      getWorkOrderList();
      if(vm.firstServiceType != '' && vm.firstServiceType != null) {
        //服务类型
        PublicService.basedata('A','A052')
          .then(function (data) {
            vm.ServicesList =data.list;
          }).catch(function (err) {
            $rootScope.catchError(err);
          });
      }else{
        vm.ServicesList = [];
      }
    };
    //服务类型下拉框选择操作
    vm.changeServices=function(){
      getWorkOrderList();
    };

    //省份选择操作
    vm.changeProvince=function(){

      if(vm.provinceId != '' && vm.provinceId != null) {
        //获取第二个下拉框（城市）
        ActivityService.getAreaList(vm.provinceId)
          .then(function (data) {
            getWorkOrderList();
            vm.CityList = data;
             vm.StoreList = [];
          })
          .catch(function (err) {
            $rootScope.messageError (err, '获取省市下拉失败，请稍后重试');
          });
      }else{
         vm.StoreList = [];
        vm.CityList = [];
        vm.cityId='';
        vm.storeId = '';
        getWorkOrderList();
      }
    };


    //城市下拉框选择操作
    vm.changeCity=function(){
       vm.StoreList=[];
      if(vm.provinceId != '' && vm.provinceId != null) {
        getStoreList();
      }
      getWorkOrderList();
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
        getWorkOrderList();
      }else {
        vm.StoreList = [];
        vm.storeId = '';
        getWorkOrderList();
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
      getWorkOrderList();
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
      getWorkOrderList();
    };

    //服务类型
    /*vm.FUWU_TYPE = [
      {value: '1', name: '直接维修'},
      {value: '2', name: '更换配件'},
      {value: '3', name: '调件维修'},
      {value: '4', name: '专家求助'}
    ];*/
    //PublicService.basedata('A','A052')
    //  .then(function (data) {
    //    vm.FUWU_TYPE =data.list;
    //  }).catch(function (err) {
    //  $rootScope.catchError(err);
    //});
    //星级标准
    vm.STAR_LEVEL = [
      {val: '5', name: '5.0'},
      {val: '4', name: '4.0'},
      {val: '3', name: '3.0'},
      {val: '2', name: '2.0'},
      {val: '1', name: '1.0'},
      {val: '0', name: '未评价'}
    ];


    DealorderService.QueryDealPeople($rootScope.userInfo.userId)
      .then(function (data) {
        vm.HANDLE_PERSON =data;
      }).catch(function (err) {
        $rootScope.catchError(err);
    });

     vm.returnStart=function () {
       vm.query = {
         keyword: "",
         orderType:"",
         orderStatus:"",
         satisfaction:"",
         operatorId:"",
         dateType:"",
         createTimeStart:"",
         createTimeEnd:""
        };
       vm.provinceId='';
       vm.cityId='';
       vm.storeId='';
       vm.firstServiceType='';
       vm.serviceType='';
       vm.serviceTime='';
       vm.pageIndex = 1;
       vm.pageSize = 10;
       getWorkOrderList();
     };

    /**
     * 查询工单处理列表方法
     */
    function getWorkOrderList() {
      DealorderService.WorkOrderList(vm.pageIndex, vm.pageSize, vm.query,vm.userId,vm.provinceId,vm.cityId,vm.storeId,vm.firstServiceType,vm.serviceType,vm.serviceTime)
        .then(function (data) {
         vm.sendMsgData = convert(data.list);
        vm.total = data.total;
      })
        .catch(function (err) {
        $rootScope.catchError(err);
      });
    }

    function getWorkOrderList2() {
      DealorderService.WorkOrderList(vm.pageIndex, vm.pageSize, vm.query,vm.userId,vm.provinceId,vm.cityId,vm.storeId,vm.firstServiceType,vm.serviceType,vm.serviceTime)
        .then(function (data) {
        vm.sendMsgData = convert(data.list);
        vm.total = data.total;
      })
        .catch(function (err) {
        $rootScope.consoleError(err);
      });
    }

    getWorkOrderList();

    /**
     * 高级查询与关键字查询方法
     */
    vm.advSearch = function () {
      vm.pageIndex = 1;
      getWorkOrderList();
    };


    /**
     * 数据转换
     * @param objs
     * @returns {*}
     */
    function convert(objs) {
      //var showData = [];
      angular.forEach(objs, function (data, index, arr) {
        var buttonShowFlg = {
          viewFlg:true,
          modifyFlg:false,
          replyFlg:false,
          sendFlg:false,
          cancelFlg:false,
          closeFlg:false,
          visitFlg:false
        };
        if(data.woStatus != null && data.woStatus != "") {/*&& data.useRole == '1001'*/
          if (data.woStatus == 1) {
            buttonShowFlg.sendFlg = true;
          }
          if (data.woStatus <= 2) {
            buttonShowFlg.cancelFlg = true;
          }
          if (data.woStatus <= 6) {
            buttonShowFlg.modifyFlg = true;
          }
         /* if ((data.woStatus == 5) || (data.woStatus == 6)) {
            buttonShowFlg.closeFlg = true;
          }*/
          if ((data.woStatus == 7)&& (data.userRate > 0) && (data.userRate <= 2) && (data.answerStatus != 1)) {
            buttonShowFlg.visitFlg = true;
          }
          if ((data.woStatus == 7) && (data.userRate == null)) {
            buttonShowFlg.visitFlg = true;
          }
          if (data.expertFlag == 0 && data.woStatus == 4) {
            buttonShowFlg.replyFlg = true;
          }
        }
        data.buttonShowFlg=buttonShowFlg;
      });
      return objs;
    }


    /**
     * 页码点击方法
     * @param pageIndex
     */
    vm.flip = function (pageIndex) {
      vm.pageIndex = pageIndex;
      getWorkOrderList();
    };

    /**
     * 显示高级选项方法
     */
    vm.formoreobj = function () {
      vm.moreobject = !vm.moreobject;
    }


    /**
     * 查看方法
     */
  vm.look = function(id){
    $state.go("tservice.dealorder.view");
  };


    /**
     * 修改方法
     */
  vm.modify = function(){

  }

    /**
     * 专家求助方法
     */
  vm.reply = function(obj){
    $uibModal.open({
      templateUrl: GetTemplateUrl('tservice.dealorder.expert'),
      controller: GetControllerName('tservice.dealorder.expert'),
      controllerAs: 'vm',
      windowClass: 'tservice-dealorder-small-expert',
      backdrop: false,
      resolve: {
        replyObj: function () {
          return obj
        }
      }
    }).result.then(function () {
        getWorkOrderList();
        //console.log(result);
      });
  };

    /**
     * 分派方法
     */
  vm.send = function(obj){
    $uibModal.open({
      templateUrl: GetTemplateUrl('tservice.dealorder.assign'),
      controller: GetControllerName('tservice.dealorder.assign'),
      controllerAs: 'vm',
      windowClass: 'tservice-dealorder-small-assign',
      backdrop: false,
      resolve: {
        assignObj: function () {
          return obj
        }
      }
    }).result.then(function () {
         getWorkOrderList();
      });
  };

    /**
     * 取消工单方法
     */
  vm.cancelOrder = function(obj){
    $uibModal.open({
      templateUrl: GetTemplateUrl('tservice.dealorder.cancel'),
      controller: GetControllerName('tservice.dealorder.cancel'),
      controllerAs: 'vm',
      windowClass: 'tservice-dealorder-small-cancel',
      backdrop: false,
      resolve: {
        filter:function () {
          return obj;
        }
      }
    }).result.then(function () {
          getWorkOrderList();
      });
    };

    /**
     * 关闭工单
     */
    vm.toClose = function (obj) {
      $uibModal.open({
        templateUrl: GetTemplateUrl('tservice.dealorder.close'),
        controller: GetControllerName('tservice.dealorder.close'),
        controllerAs: 'vm',
        windowClass: 'tservice-dealorder-small-close',
        backdrop: false,
        resolve: {
          closeObj: function () {
            return obj
          }
        }
      }).result.then(function () {
            getWorkOrderList()
         });
    };

    /**
     * 回访
     */
    vm.toVisit = function (obj) {
      $uibModal.open({
        templateUrl: GetTemplateUrl('tservice.dealorder.visit'),
        controller: GetControllerName('tservice.dealorder.visit'),
        controllerAs: 'vm',
        windowClass: 'tservice-dealorder-small-visit',
        backdrop: false,
        resolve: {
          visitObj: function () {
            return obj
          }
        }
      }).result.then(function () {
        getWorkOrderList()
         });
    };

    /*导出*/
    vm.getExecl=function () {
      var email='';
      DealorderService.getExeclLink(email,vm.pageIndex, vm.pageSize, vm.query,vm.userId,vm.provinceId,vm.cityId,vm.storeId,vm.firstServiceType,vm.serviceType,vm.serviceTime)
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
              templateUrl: GetTemplateUrl('tservice.dealorder.email'),
              controller: GetControllerName('tservice.dealorder.email'),
              controllerAs: 'vm',
              backdrop: false,
              resolve: {
                pageIndex: function () {return vm.pageIndex;},
                pageSize: function () {return vm.pageSize;},
                query: function () {return vm.query;},
                userId: function () {return vm.userId;},
                provinceId: function () {return vm.provinceId;},
                cityId: function () {return vm.cityId;},
                storeId: function () {return vm.storeId;},
                firstServiceType: function () {return vm.firstServiceType;},
                serviceType: function () {return vm.serviceType;},
                serviceTime: function () {return vm.serviceTime;}
              }
            })
          }else{
            $rootScope.catchError(err);
          }
        })
    }


  }
})();
