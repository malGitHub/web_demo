(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceController', TserviceController);

  /** @ngInject */
  function TserviceController($rootScope,$location,$interval,DealorderService) {
    var vm = this;
    vm.isShowSiderbar = true;
    vm.pathUrl="/"+$location.$$path.split("/")[2]+"/";
    vm.hideNav=function(){
      vm.catalogone=false;
      vm.catalogtwo=false;
      vm.catalogthr=false;
      vm.catalogfour=false;
      vm.catalogfive=false;
    };
    vm.hideNav();
    if("/authentication/upkeep/care/webim/app/breakdown/telephone/message/subscribe/carecall/vehicles/vehiclesview/banner/".indexOf(vm.pathUrl)>-1){
      vm.hideNav();
      vm.catalogone=true;
    }
    if("/dptcontrol/role/user/".indexOf(vm.pathUrl)>-1){
      vm.hideNav();
      vm.catalogtwo=true;
    }
    if("/build/assigndocument/dealorder/close/outrescue/buildnew/dealorderview/closeview/statistics/".indexOf(vm.pathUrl)>-1){
      vm.hideNav();
      vm.catalogthr=true;
    }
    if("/activities/activitiesadd/activitiesstep/activitiesnew/grant/grantdit/grantinfo/cash/cashdit/cashinfo/activitiescheck/".indexOf(vm.pathUrl)>-1){
      vm.hideNav();
      vm.catalogfour=true;
    }

    vm.toggleSiderbar = function () {
      vm.isShowSiderbar = !vm.isShowSiderbar;
    };

/*    /!*外出救援每分钟刷新*!/
    var outquery={
      woId:'',
      state:'0',
      userId:$rootScope.userInfo.userId
    };
    vm.outListCount=0;
    function getOutList() {
      OutrescueService.QueryList("1","20",outquery)
        .then(function (data) {
          vm.outListCount=data.total;
          // console.log('外出救援',vm.outListCount);
          // console.log(data.total);
        })
        .catch(function (err) {
          /!*$rootScope.consoleError(err);*!/
          console.log(err)
        });
    }
    /!*客服分单每分钟刷新*!/
    vm.customerNum=0;
    function getCustomerTotal(){
      CustomerService.CustomerList("1","20",{woId:'',woType:'',orderWay:''},$rootScope.userInfo.userId)
        .then(function (data) {
          vm.customerNum=data.total;
        })
        .catch(function (err) {
          // $rootScope.consoleError(err);
          console.log(err);
    });
    }

    /!*工单处理每分钟刷新*!/
    vm.WorkOrderCount=0;
    vm.WorkOrderquery = {
      keyword: "",
      orderType:"",
      orderStatus:"1",
      satisfaction:"",
      operatorId:"",
      dateType:"",
      serviceType:""
    };
    function getWorkOrderList() {
      DealorderService.WorkOrderList('1', '20', vm.WorkOrderquery,outquery.userId)
        .then(function (data) {
        vm.WorkOrderCount = data.total;
        // console.log('工单处理',vm.WorkOrderCount);
        // console.log(data.total);
      }).catch(function (err) {
        // $rootScope.consoleError(err);
        console.log(err);
      });
    }
    $rootScope.OutrescueFuncs=$interval(function () {
      getOutList();
      getWorkOrderList()
    }, 1000*60 );
    $rootScope.CustomerFuncs=$interval(function () {
      getCustomerTotal();
    }, 1000 *30 );
    getOutList();
    getCustomerTotal();
    getWorkOrderList();*/
    vm.WorkOrderCount = 0;
    vm.customerNum=0;
    vm.outListCount=0;
    vm.closeWoLoop=0;
    function queryWoLoop() {
      DealorderService.queryWoLoop($rootScope.userInfo.userId)
        .then(function (data) {
          vm.customerNum=data[0].woLoop;
          vm.WorkOrderCount = data[1].woLoop;
          vm.closeWoLoop=data[2].woLoop;
          vm.outListCount=data[3].woLoop;
        }).catch(function (err) {
        console.log(err);
      });
    }
    $rootScope.queryWoLoopFucs=$interval(function () {
      queryWoLoop();
    }, 1000 *60 );
    queryWoLoop();

  }
})();
