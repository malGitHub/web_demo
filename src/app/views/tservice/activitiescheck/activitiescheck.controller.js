 /**
 * Created by mal on 2016/12/22.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceActivitiescheckController', TserviceActivitiescheckController);
  function TserviceActivitiescheckController($rootScope,$stateParams,ActivityService, ActivityListService,Message,$state){
    var vm = this;
    vm.title="活动详情";
    vm.read = true;
    vm.id = $stateParams.id;
    vm.requesting = false;
    vm.selectedSeries = [];
    vm.carChassisList=[];
      if ($stateParams.ischeck == '审核中'||$stateParams.ischeck == '冻结中') {
      vm.ischeck = '2';
    } else {
      vm.ischeck = '1';
    }
     if(vm.ischeck=='2'){
      vm.auditread=false;
    }else{
      vm.auditread=true;
    }

      ActivityListService.activityDetail(vm.id)
        .then(function (data) {
          vm.sendType=data.sendType;
          vm.offlineType=data.offlineType;
           if (data.activityEndDate == null) {
            data.aciveTimeInput = '0';
          } else {
            data.aciveTimeInput = '-1';
          }
           vm.detail = data;
          vm.selectedSeries=vm.detail.carList;
          vm.carChassisList=vm.detail.carChassisNumList;
           if(vm.selectedSeries.length==0&&vm.carChassisList.length!=0){
            vm.selSeries=false;
          }else {
            vm.selSeries=true;
          }
          if(vm.carChassisList.length==0){
            vm.carSeries=false;
          }else {
            vm.carSeries=true;
          }
         })
        .catch(function (err) {
          $rootScope.catchError(err);

        });
    vm.query1={
      keyWord:"",
      page_size:10,
      page_number:1,
      provinceId:"",
      cityId:"",
      stationId:"",
      stationType:"",
      flag:""
    };
    vm.queryTotal=function () {
      //已添加网点查询列表
      ActivityService.alreadyAddedGrantStation(vm.id,vm.query1)
        .then(function (data) {
          vm.addedStationList=data.list;
          vm.total1=data.total;
        }).catch(function (err) {
        $rootScope.catchError(err);
      });

    };
    vm.queryTotal();
    vm.query2={
      keyWord:"",
      page_size:10,
      page_number:1,
      provinceId:"",
      cityId:"",
      stationId:"",
      stationType:"",
      flag:""
    };
    vm.queryTotalExchange=function () {
      ActivityService.alreadyAddedExchangeStation(vm.id,vm.query2)
        .then(function (data) {
          vm.addedStationList_ex=data.list;
          vm.total2=data.total;
        }).catch(function (err) {
        $rootScope.catchError(err);
      });
    };
     vm.queryTotalExchange();
    //分页
    vm.flip1= function (page_number) {
      vm.query1.page_number = page_number;
      vm.queryTotal();
     };
    vm.flip2= function (page_number) {
      vm.query2.page_number = page_number;
      vm.queryTotalExchange();
    };
     vm.datavies=[
      {viewId:3,viewName:"通过"},
      {viewId:4,viewName:"不通过"}
    ];
    //提交
    vm.submit = function (evt, form) {
      evt.preventDefault();
      if (form.$valid && !vm.requesting) {
        vm.requesting = true;
        var obj = {
          activityId: vm.id,
          reviewerId: $rootScope.userInfo.userId,
          reviewerName: $rootScope.userInfo.userName,
          reviewContent: vm.detail.reviewContent,
          reviewStatus: vm.detail.reviewStatus
        };
         ActivityListService.activityUpdate(obj)
          .then(function (data) {
            Message.success('审核成功！');
            vm.close();
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          })
          .then(function () {
            vm.requesting = false;
          });
      }
    };
    vm.close = function (){
      $state.go('tservice.activities');
     };
   }

})();


