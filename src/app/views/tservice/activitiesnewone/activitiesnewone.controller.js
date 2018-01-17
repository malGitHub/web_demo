/**
 * Created by Administrator on 2017/5/8.
 */
 (function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceActivitiesnewoneController', TserviceActivitiesnewoneController);
  function TserviceActivitiesnewoneController($rootScope,$stateParams,$timeout,$uibModal,GetTemplateUrl,GetControllerName, ActivityService,TbossService,Message,$state,ActivityListService){
    var vm = this;
    vm.title="活动详情";
     vm.read = true;//为true不可编辑
    vm.pathRead = true;//已发布的活动、进行中的活动
    vm.overdue=true;//已发布的活动、进行中的活动
    vm.queryInfo={};
    vm.save="编辑";
    vm.id=$stateParams.id;  //活动id
    vm.actStatus=$stateParams.status; //活动状态
    vm.isCancel=$stateParams.cancel; //取消按钮
    vm.userId = $rootScope.userInfo.userId;
    vm.userName = $rootScope.userInfo.userName;
      //获取活动详情内容
    ActivityListService.activityDetail(vm.id)
      .then(function (data) {
        vm.list=data;
        vm.sendType=data.sendType;//下发
        vm.stopType=data.stopType;//冻结
        vm.offlineType=data.offlineType;//下架
        vm.activeStatus=data.reviewStatus;//审核状态
         //获取列表判断
        if(vm.list.activityEndDate=='' || vm.list.activityEndDate==undefined || vm.list.activityEndDate==null){
          vm.aciveTimeInput='0'
        }else{
          vm.aciveTimeInput='-1'
        }
        //单车发放限额
        if(vm.list.singleQuota==1){
          vm.queryInfo.singleQuota='1'
        }else{
          vm.queryInfo.singleQuota='-1'
        }
      })
      .catch(function (err) {
        $rootScope.catchError(err);
      });
      vm.singleFunc=function () {
      switch(vm.queryInfo.singleQuota)
      {
        case '1':
          vm.list.singleQuota=1;
          break;
        default:
      }
    };

    //取消编辑
    vm.closeAdd = function (){
      $state.go('tservice.activities');
     };

    /*本地时间*/
    vm.nowTime=new Date();
    /*校验字符和和汉字*/
    vm.getBLen = function(str) {
      if (str == null) return 0;
      if (typeof str != "string"){
        str += "";
      }
      return str.replace(/[^\x00-\xff]/g,"01").length;
    };
     /********************************************编辑***************************************/
     vm.edit_click=false;
     vm.editConfirm=function () {
        //活动状态为已下发，需要弹窗确认
      //活动状态为冻结中，发放数量、发放网点和兑换网点可编辑（vm.pathRead=false）
      //活动状态为已下架或者已过期，发放数量和兑换网点可编辑（vm.overdue=false）
      if(vm.sendType==1){
        Message.confirm('该活动已经下发，请先进行活动冻结，才能再次编辑')
          .then(function () {
            $state.go('tservice.activities');
          });
      }else if(vm.actStatus==6){
        Message.confirm('是否确定编辑?')
          .then(function () {
            vm.edit_click=true;
            vm.read=true;
            vm.pathRead=false;
            vm.overdue=false;
          });
       }else if(vm.actStatus==2||vm.actStatus==5){
        Message.confirm('是否确定编辑?')
          .then(function () {
            vm.edit_click=true;
            vm.read=true;
            vm.pathRead=true;
            vm.overdue=false;
          })
       }else {
        Message.confirm('是否确定编辑?')
          .then(function () {
            vm.edit_click=true;
            vm.read=false;
            vm.pathRead=false;
            vm.overdue=false;
          });

      }
    };
     //保存并下一步
    vm.submit = function (state) {
      var queryInfo={
        activityId:vm.id,
        activityName:vm.list.activityName,
        activityStartDate:vm.list.activityStartDate,
        activityEndDate:vm.list.activityEndDate,
        activityQuota:vm.list.activityQuota,
        couponName:vm.list.couponName,
        couponContent:vm.list.couponContent,
        couponUnit:vm.list.couponUnit,
        expirationStatus:vm.list.expirationStatus,
        expirationDays:vm.list.expirationDays,
        expirationStartDate:vm.list.expirationStartDate,
        expirationEndDate:vm.list.expirationEndDate,
        reviewStatus:state,
        creatorId:$rootScope.userInfo.userId,
        creatorName:$rootScope.userInfo.userName,
        singleQuota:vm.list.singleQuota
      };
      vm.requesting = true;
      if(vm.edit_click==true){
         Message.confirm('确定要进行下一步？以上信息将全部保存', '确定')
          .then(function () {
            vm.cancelDis=1;
              ActivityListService.update(queryInfo)
              .then(function () {
                $state.go('tservice.activitiesnewtwo', {id: vm.id, status: vm.actStatus,cancel:vm.cancelDis});
                })
              .catch(function (err) {
                Message.error(err.message);
              })
              .then(function () {
                vm.requesting = false;
              });
          }).catch(function () {
           vm.cancelDis=0;
         })
      }else {
        vm.cancelDis=0;
        $state.go('tservice.activitiesnewtwo', {id: vm.id, status:vm.actStatus,cancel:vm.cancelDis});
      }


    };
   }

})();
