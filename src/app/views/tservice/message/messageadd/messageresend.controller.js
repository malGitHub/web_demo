
/**
 * Created by wangshuai on 2016/11/7.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceMessageMessageresendController', TserviceMessageMessageresendController);
  function TserviceMessageMessageresendController($uibModalInstance,TbossService,MessageService,$rootScope,Message,id) {
    var vm = this;
    vm.title="消息重发";
    vm.id = id;
    vm.partuserdiv=false;
    vm.specialuserdiv=false;
    vm.sendtimediv=false;
    vm.createInfo=true;
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


    vm.query= {
      describe:'',
      title:'',
      content:'',
      targetUser:'',
      brandId:'5',
      seriseId:'',
      modelId:'',
      role:'',
      deviceId:'',
      sendType:'',
      sendTime:'',
      validity:'',
      saveDays:'0',
      saveHours:'0',
      sendTimeRadio:'',
      userName:'',
      createTime:''
    };

   MessageService.getResendNotice(vm.id).then(function (data) {
     vm.query.describe=data.descInfo;
     vm.query.title=data.title;
     vm.query.content=data.content;
     vm.contentLen=500-data.content.length;
     vm.query.targetUser=data.targetUser;
     if(vm.query.targetUser=='1'){
       vm.partuserdiv = true;
     }else if(vm.query.targetUser=='2'){
       vm.specialuserdiv = true;
     }

     vm.query.role=data.role!=null?data.role.toString():'';
     vm.query.deviceId=data.deviceId;
     vm.query.sendTime=data.sendTime;
     vm.query.sendType = data.sendType;
     if(vm.query.sendTime!=null){
        vm.query.sendTimeRadio=1;
        vm.sendtimediv = true;
     }else{
        vm.query.sendTimeRadio=0;
     }
     vm.query.validity=data.validity;
     vm.query.saveDays=data.saveDays!=null?data.saveDays.toString():'';
     vm.query.saveHours=data.saveHours!=null?data.saveHours.toString():'';
     vm.query.userName=data.userName;
     vm.query.createTime=data.createTime;
     if(data.seriseId!=null){
       vm.query.seriseId=parseInt(data.seriseId);
       vm.query.modelId=parseInt(data.modelId);
       getCAR_SERVICE(5);
       getCAR_MODEL(vm.query.seriseId);
     }
   })
     .catch(function (err) {
         $rootScope.catchError(err);
         $uibModalInstance.dismiss();
   }
   );

    /*function getCAR_CHOICE(){
      TbossService.getBrandList()
        .then(function (data) {

          vm.CAR_TYPE=data;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }*/
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
          $uibModalInstance.close();
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
        if(radioValid()) {
          vm.requesting = true;
          MessageService.addMessage(vm.query)
            .then(function () {
              Message.success('消息重发成功！');
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
      if(vm.query.validity == '1'){
        if(vm.query.saveDays == ''){Message.error("请选择保存的天数！");return false;}
        if(vm.query.saveHours == ''){Message.error("请选择保存的小时数！");return false;}
      }
      return true;
    }

  }

})();
