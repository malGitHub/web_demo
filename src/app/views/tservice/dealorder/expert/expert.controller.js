
/**
 * Created by wangshuai on 2016/11/14.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceDealorderExpertController', TserviceDealorderExpertController);
  function TserviceDealorderExpertController($uibModalInstance,$state,Message,$rootScope,replyObj,DealorderService) {
    var vm = this;
    vm.title="专家求助回复";
    vm.requesting=false;
    vm.content="";
    vm.userId=$rootScope.userInfo.userId;
    vm.info = replyObj;

    vm.woCode = replyObj.woCode;
    vm.woStatus = replyObj.woStatus;
    vm.carVin = replyObj.carVin;
    vm.content = "";

    vm.close = function (){
      $uibModalInstance.dismiss();
    };

    //获取专家求助内容
    DealorderService.GetRecord(vm.info.woCode,"1","5").then(function (data) {
      vm.info = data[0];
      switch (vm.info.maintenanceWay){
        case '1': vm.info.maintenanceWay="直接维修";
                break;
        case '2' : vm.info.maintenanceWay="更换备件";
                break;
        case '3': vm.info.maintenanceWay="调件维修";
          break;
        case '4' : vm.info.maintenanceWay="专家求助";
          break;
        default :break;
      }
/*1:直接维修 2:更换备件 3:调件维修 4:专家求助*/
     }).catch(function (err) {
      $rootScope.messageError (err, '获取求助内容失败，请稍后重试');
      vm.close();
      }
    );

    //提交
    vm.submit = function (evt,form) {
      evt.preventDefault();
      if (form.$valid && !vm.requesting){
        vm.requesting=true;
        DealorderService.AddOperate(vm.woCode,"4",vm.carVin,vm.userId,"2","5",vm.content)
        .then(function () {
          Message.success('专家回复成功！');
          $uibModalInstance.close();
        })
        .catch(function (err) {
          vm.requesting=false;
          $rootScope.messageError (err, '日志记录失败，请稍后重试');
        });
      }

    };

  }

})();

