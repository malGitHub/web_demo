
/**
 * Created by wangshuai on 2016/11/7.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceMessageMessageaddController', TserviceMessageMessageaddController);
  function TserviceMessageMessageaddController($uibModalInstance,TbossService,MessageService,Message,$rootScope) {
    var vm = this;
    vm.title="新建消息";
    vm.partuserdiv=false;
    vm.specialuserdiv=false;
    vm.sendtimediv=false;
    vm.createInfo=false;
    vm.keyword = '';
    vm.RESULT = [];
    vm.list1model = '';
    vm.list2model = '';
    vm.contentLen = 500;

    vm.forPartUserDiv = function () {
      vm.partuserdiv = true;
      vm.specialuserdiv=false;
    };
    vm.forSpecialUserDiv = function () {
      vm.partuserdiv = false;
      vm.specialuserdiv=true;
      vm.query.brandId='';
      vm.query.seriseId='';
      vm.query.modelId='';
      vm.query.role='';
    };
    vm.forAllUserDiv = function () {
      vm.partuserdiv = false;
      vm.specialuserdiv=false;
      vm.query.brandId='';
      vm.query.seriseId='';
      vm.query.modelId='';
      vm.query.role='';
      vm.query.deviceId='';
    };
    vm.forPartUserDiv = function () {
      vm.partuserdiv = true;
      vm.specialuserdiv=false;
      vm.query.deviceId='';
    };
    vm.forDsSend = function () {
      vm.sendtimediv = true;
    };
    vm.forLjSend = function () {
      vm.sendtimediv = false;
      vm.query.sendTime = '';
    };
    vm.closeAdd = function (){
      $uibModalInstance.dismiss();
    };
    vm.query={
      describe:'',
      title:'',
      content:'',
      targetUser:'0',
      brandId:'',
      seriseId:'',
      modelId:'',
      role:'',
      deviceId:'',
      sendType:'0',
      sendTime:'',
      validity:'0',
      saveDays:'6',
      saveHours:'24',
      sendTimeRadio:'0'
    };

    function getCAR_CHOICE(){
      TbossService.getBrandList()
        .then(function (data) {
          vm.CAR_TYPE=data;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }
    getCAR_CHOICE();
    getCAR_SERVICE(5);
    vm.changeSelect=function(obj){
      getCAR_SERVICE(obj);
      vm.query.seriseId='';
    };
    function getCAR_SERVICE(va){
      TbossService.getSeriseList(va)
        .then(function (data) {
          vm.CAR_SERIES=data;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }
    //getCAR_SERVICE();
    vm.changeSelectType=function(obj){
      getCAR_MODEL(obj);
      vm.query.modelName='';
    };
    function getCAR_MODEL(va){
      TbossService.getModelList(va)
        .then(function (data) {
          vm.CAR_Model=data;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }

    vm.getDeviceInfo = function(){
      $("select[name=list1] option").remove();
      $("select[name=list2] option").remove();
      if(vm.keyword != ''){
        MessageService.getDeviceInfo(vm.keyword).then(function (data) {
          vm.RESULT = data.list;
          vm.list1model = data.list[0].deviceId;
        });
      }else{
        Message.error("请输入搜索关键字！");
      }
    };

    vm.submit = function (evt, form) {
      evt.preventDefault();
      if (form.$valid && !vm.requesting) {
        vm.query.deviceId = '';
        for(var i=0;i<document.add_form.list2.options.length;i++){
          if(document.add_form.list2.options[i].text!='') {
            var devicestr = document.add_form.list2.options[i].value.toString();
            vm.query.deviceId += devicestr.substr(7,devicestr.length)  + ",";
          }
        }
        vm.query.deviceId = vm.query.deviceId.substr(0,vm.query.deviceId.length-1);
        if(vm.query.deviceId.substr(0,1) === ','){
          vm.query.deviceId = vm.query.deviceId.substr(1,vm.query.deviceId.length);
        }
        if(radioValid()){
          vm.requesting = true;
          MessageService.addMessage(vm.query)
            .then(function () {
              Message.success('消息新建成功！');
              $uibModalInstance.close();
            })
            .catch(function (err) {
              Message.error(err.message);
            })
            .then(function () {
              vm.requesting = false;
            });
        }
      }
    };

    function radioValid(){
      if(vm.query.targetUser == '1'){
        if(vm.query.seriseId == ''){Message.error("请选择车系！");return false;}
        if(vm.query.modelId == ''){Message.error("请选择车型！");return false;}
        if(vm.query.role == ''){Message.error("请选择角色！");return false;}
      }
      if(vm.query.targetUser == '2'){
        if(vm.query.deviceId == ''){Message.error("请搜索要发送的设备并添加到右侧列表！");return false;}
      }
      if(vm.query.sendTimeRadio == '1'){
        if(vm.query.sendTime == ''){Message.error("请选择定时推送时间！");return false;}
      }
      return true;
    }



  }

})();

