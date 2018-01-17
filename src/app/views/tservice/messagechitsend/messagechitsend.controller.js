/**
 * Created by Administrator on 2017/3/22.
 */
 (function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceMessagechitsendController', TserviceMessagechitsendController);
  function TserviceMessagechitsendController($state,$rootScope,$uibModal,GetTemplateUrl,GetControllerName,$stateParams,MessageService,Message,myParams,$timeout) {
    var vm = this;
    vm.id = $stateParams.id;
    vm.title='';
    vm.userPhone='';
    vm.userPhoneNumbers='';
    vm.content='';
    vm.requesting = false;
    //内容框字数限制
    vm.countChar=function () {
      if(vm.content=='' || vm.content==null){
        vm.contentLen=500;
        return false;
      }else{
        vm.contentLen=500-vm.content.length;
      }
    };
     //获取已发送的消息
     vm.sendInfo=function () {
      MessageService.sendChit(vm.id).then(function (data) {
          vm.title=data.title;
          vm.content=data.content;
          vm.userPhoneNumber=data.userPhoneNumbers;
           vm.userPhoneNumbers=vm.userPhoneNumber.split(",");
          if(vm.userPhone!=''){
            vm.userPhoneNumbers.push(vm.userPhone);
            vm.userPhone='';
          }
          vm.countChar();
         })
        .catch(function (err) {
            $rootScope.messageError (err, '获取短信息详情失败，请稍后重试');
            $state.go('tservice.message');
            myParams.set({"active":1});
          }
        );
    };
    vm.sendInfo();
    //添加电话号码
    vm.numberAdd=function () {
       function contains(arr, val) {
        if (arr.indexOf(val) == -1) {
          vm.userPhoneNumbers.push(vm.userPhone);
        } else {
          Message.error('您添加的号码已经存在，请勿重复添加');
        }
      }
       if(vm.userPhoneNumbers==''){
          vm.userPhoneNumbers=[];
          vm.userPhoneNumbers.push(vm.userPhone);
         vm.userPhone='';
         }else {
        contains(vm.userPhoneNumbers, vm.userPhone);
        vm.userPhone='';
      }
       };

    //删除电话号码
     vm.numberDelete = function(index){
      vm.userPhoneNumbers.splice(index,1);
    };
    //关闭消息重发页面
    vm.closeAdd = function (){
      myParams.set({"active":1});
      $state.go('tservice.message');
    };
    //导入
    vm.openImport = function () {
      var createStateName = 'tservice.messagechitsend.import';
      $uibModal.open({
        templateUrl: GetTemplateUrl(createStateName),
        controller: GetControllerName(createStateName),
        controllerAs: 'vm',
        windowClass: 'tservice-messagechitsend-small-import',
        backdrop:false,
        resolve: {
          title: function () {return vm.title;},
          content: function () {return vm.content;},
          userPhoneNumbers: function () {return vm.userPhoneNumbers;}
        }
      }).result.then(function (result) {
           if(result.userPhoneNumbersErr!=""){
             vm.item(result);
          }else if(result.userPhoneNumbers == vm.userPhoneNumbers.join(",")){
             Message.error('导入失败，请稍后重试');
             vm.userPhoneNumbers=result.userPhoneNumbers.split(",");
           }else {
             Message.success('导入成功,2s后刷新列表');
             $timeout(function() {
               vm.userPhoneNumbers=result.userPhoneNumbers.split(",");
             },2000);
           }


      });
    };
    //提示非法电话号码
    vm.item=function(msg){
      $uibModal.open({
        templateUrl:GetTemplateUrl('tservice.messagechitsend.phone'),
        controller: GetControllerName('tservice.messagechitsend.phone'),
        controllerAs: 'vm',
        windowClass: 'tservice-messagechitsend-small-phone',
        backdrop:false,
        resolve: {
          userPhoneNumbersErr: function () {return msg.userPhoneNumbersErr;},
          userPhoneNumbers: function () {return msg.userPhoneNumbers;}
         }
      }).result.then(function (result) {
        Message.success('导入成功');
        $timeout(function() {
          vm.userPhoneNumbers=result.split(",");
        },2000);
        });

    };
    //提交
    vm.submit = function (evt, form) {
       evt.preventDefault();
      if (form.$valid && !vm.requesting) {
        vm.requesting = true;
        MessageService.addChit(vm.title,vm.content,vm.userPhoneNumbers.join(','))
          .then(function () {
            Message.success('短信息新建成功！');
            $state.go('tservice.message');
            myParams.set({"active":1});
          })
          .catch(function (err) {
            Message.error(err.message);
          })
          .then(function () {
            vm.requesting = false;
          });

      }
    };



  }

})();
