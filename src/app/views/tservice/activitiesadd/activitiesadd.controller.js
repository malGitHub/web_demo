
/**
 * Created by mal on 2016/12/22.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceActivitiesaddController', TserviceActivitiesaddController);
  function TserviceActivitiesaddController($state,$rootScope,ActivityService,Message){
    var vm = this;
    vm.title="新建活动";
    vm.userId = $rootScope.userInfo.userId;
    vm.userName = $rootScope.userInfo.userName;
    vm.requesting=false;
    vm.query={
      activityName:'',
      activityStartDate:'',
      activityEndDate:'',
      activityQuota:'',
      singleQuota:'1',
      couponName:'',
      couponContent:'',
      couponUnit:'',
      expirationStatus:'0',
      expirationDays:'',
      expirationStartDate:'',
      expirationEndDate:'',
      creatorId:vm.userId,
      creatorName:vm.userName,
      sendType:'0',
      offlineType:'0',
      reviewStatus:'1'
    };
    vm.EndDate = '0';
    vm.singleModel = '1';

    //关闭新建消息页面
    vm.closeAdd = function (){
      vm.query='';
      $state.go('tservice.activities');
    };

    vm.changeSelectCustom = function(){
      if(vm.singleModel=='1'){
        vm.query.singleQuota = 1;
      }
    };

    //保存并下一步
    vm.submit = function (evt, form) {
      evt.preventDefault();
      if (form.$valid && !vm.requesting) {
        if(vm.query.activityQuota >=　vm.query.singleQuota) {
          vm.requesting = true;
          ActivityService.addActivity(vm.query).then(function (data) {
            $state.go('tservice.activitiesstep', {id: data.activityId, quota: vm.query.activityQuota});
          })
            .catch(function (err) {
              vm.requesting = false;
              $rootScope.catchError(err);

            });
        }else{
          Message.error('单车发放数量超过活动总发放数量限制！');
        }
      }
    };
    /*本地时间*/
    vm.nowTime=new Date();
  }

})();

