(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceOutrescueController', TserviceOutrescueController);

  /** @ngInject */
  function TserviceOutrescueController($uibModal,$rootScope,GetTemplateUrl,GetControllerName, myParams,Message, OutrescueService,DateUtil,$interval) {
    var vm = this;

    $rootScope.OutrescueInterval = $interval(function () {
      getList2();
    }, 1000 *60*1);
    vm.moreobject=false;
    vm.pageIndex = 1;
    vm.pageSize =10;
    vm.orderBy =false;
    vm.woId1 = '';
    vm.woId2 = '';
    vm.state = '0';
    vm.query={
      woId:'',
      state:'0',
      userId:$rootScope.userInfo.userId
    };
     myParams.set({"nature":1});
    vm.formoreobj=function(){
      vm.moreobject=!vm.moreobject;
      if(vm.moreobject==false) {
        vm.woId2 = '';
        vm.state = '0';
        vm.query.state = '0';
      }
    };
    vm.flip = function (pageIndex) {
      vm.pageIndex = pageIndex;
      if(vm.moreobject==false){
        getList();
      }else{
        vm.advancedSearchList(vm.query.woId,vm.query.state,vm.pageIndex);
      }

    };
    //审核
    vm.workCheck=function(workOrder,closeReason,vin,robAccount){
      $uibModal.open({
        templateUrl:GetTemplateUrl('tservice.outrescue.outrescuecheck'),
        controller: GetControllerName('tservice.outrescue.outrescuecheck'),
        controllerAs: 'vm',
        windowClass: 'tservice-outrescue-small-outrescuecheck',
        resolve:{        //传参
          workOrder:function(){return workOrder},
          closeReason:function(){return closeReason},
          vin:function(){return vin},
          robAccount:function(){return robAccount}
        },
        backdrop: true
      }).result.then(function () {//回传到父级页面
          getList();
          Message.success('操作成功');
        });
    };
    vm.searchNumber=function(){
      getList();
    };
    //列表初期化
    function getList() {
      vm.query.woId='';
      vm.query.state = '0';
      OutrescueService.QueryList(vm.pageIndex,vm.pageSize,vm.query)
        .then(function (data) {
          vm.mydata=data.list;
          vm.total=data.total;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }
    function getList2() {
      vm.query.woId='';
      vm.query.state = '0';
      OutrescueService.QueryList(vm.pageIndex,vm.pageSize,vm.query)
        .then(function (data) {
          vm.mydata=data.list;
          vm.total=data.total;
        })
        .catch(function (err) {
          $rootScope.consoleError(err);
        });
    }

    getList();

    //检索
    vm.searchList=function (woId) {
      vm.query.woId = woId;
      OutrescueService.QueryList(vm.pageIndex,vm.pageSize,vm.query)
        .then(function (data) {
          vm.mydata=data.list;
          vm.total=data.total;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }

    //高级筛选及检索
    vm.advancedSearchList=function (woId,state,page) {
      vm.query.woId = woId;
      vm.query.state = state;
      vm.pageIndex = page;
      OutrescueService.QueryList(vm.pageIndex,vm.pageSize,vm.query)
        .then(function (data) {
          vm.mydata=data.list;
          vm.total=data.total;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }
  }
})();

