/**
 * Created by wurui on 2016/10/31.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceWebimHistoryController', TserviceWebimHistoryController);
  function TserviceWebimHistoryController($scope,$rootScope,$uibModalInstance,TbossService,Message,emojiService,$timeout,WebimService,code,customerName,startTime,endTime,customerId,getHistoryMsgs ) {
    var vm = this;
    vm.closeEdit = function (){
      $uibModalInstance.dismiss();
    };
    vm.information={
      code:code,
      customerName:customerName,
      startTime:startTime,
      endTime:endTime,
      customerId:customerId
    };
    vm.headPic="http://jfx.mapbar.com/usercenter/user/queryPicById?userId="+vm.information.customerId;


    /*定义表情对象*/
    /*vm.emoji=emojiService.faceEmoji();*/
    /* var historyText='';*/
    function getHistoryMsgsDone(obj) {
      /*$('#chatContent').html("");*/
      var arr=obj.list;
      arr=arr.reverse();
      for(var i=arr.length-1;i>0||i==0;i--){
        if(i!=0){
          var lastTime=arr[i-1].time;
          if((lastTime-arr[i].time)>5*60*1000){
            var appendTime='<p class="u-msgTime">- - - - -&nbsp;'+new Date(parseInt(arr[i].time)).toLocaleString()+'&nbsp;- -- - -</p>';
            $('#chatContent').append(emojiService.buildEmoji(appendTime));
          }
        }else{
          var appendTime='<p class="u-msgTime">- - - - -&nbsp;'+new Date(parseInt(arr[i].time)).toLocaleString()+'&nbsp;- -- - -</p>';
          $('#chatContent').append(emojiService.buildEmoji(appendTime));
        }
        pushYunMsg(arr[i]);
      }

      /* vm.mytext=historyText;
       $scope.myText=vm.mytext;*/
    }
    /*
     添加消息到对话框
     */
    function pushYunMsg(msgs) {
      var who='';
      if(msgs.flow=='out'){
        who="me";
        var baseStart='<div class="item item-'+who+'"> <p class="nametime" data-time="'+msgs.time+'"></p><img class="img j-img" src="assets/webim/serviceperson.png"><div class="msg msg-text j-msg">';
      }else{
        who="you";
        var baseStart='<div class="item item-'+who+'"> <p class="nametime" data-time="'+msgs.time+'"></p><img class="img j-img" src="'+vm.headPic+'" onerror="onerror=null;src=\'assets/webim/default-icon.png\'"><div class="msg msg-text j-msg">';
      }
      var msgTime=new Date(parseInt(msgs.time)).toLocaleString();
      var baseEnd='</div></div>';
      /*添加html*/
      if(msgs.type=="TEXT"){
        var appendhtml=baseStart+'<div class="box"><div class="cnt"><div class="f-maxWid">'+msgs.content+'</div></div></div>'+baseEnd;
      }else if(msgs.type=="PICTURE"){
        var appendhtml=baseStart+'<div class="box"><div class="cnt"><a href="'+msgs.content+'" target="_blank"><img onload="loadImg()" src="'+msgs.content+'"></a></div></div>'+baseEnd;
      }else if(msgs.type=="AUDIO"){
        var appendhtml=baseStart+'<audio src="'+msgs.content+'"  controls="controls"></audio>'+baseEnd;
      }else if(msgs.type=="VIDEO"){
        var appendhtml=baseStart+'<video src="'+msgs.content+'" controls="controls" height="450px;" " ></video>'+baseEnd;
      }else{
        var appendhtml=baseStart+'<div class="box"><div class="cnt"><a href="'+msgs.content+'" target="_blank">'+msgs.content+'</a></div></div>'+baseEnd;
      }

      $('#chatContent').append(emojiService.buildEmoji(appendhtml));
      //滚动至滚动条底部
      document.getElementById('chatContent').scrollTop = document.getElementById('chatContent').scrollHeight;
    }

    /*vm.mytext=historyText;*/
    /*vm.mytext2='<div>123</div>';*/

    //获取用户和客服id；
    vm.customerId="";
    vm.serviceId="";
    vm.page_number="1";
    vm.page_size="";
    //获取登陆者账户Id
    WebimService.CrmQueryUserInfo($rootScope.userInfo.userId,'2')
      .then(function (data) {
        vm.serverUserId=data.accountId;
        getHistoryMsgsDone(getHistoryMsgs);

      })
      .catch(function (err) {
        $rootScope.catchError(err);
      });
    //获取会话Id，用户Id
/*
    function getDialogSearchId(){
      WebimService.dialogSearchId(vm.customerId,vm.serviceId,vm.page_number,vm.page_size)
        .then(function (data) {
          vm.dialogId=vm.information.code;
          getDetailHistory();
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }
*/


    //获取历史会话详情
/*    function getDetailHistory(){
      WebimService.dialogDetailAll(vm.dialogId,vm.serverUserId)
        .then(function (data) {
          vm.object=data;
          vm.object.msgs=data.list;
          getHistoryMsgsDone(data);
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }*/

    /**********************************回呼*************************************************/

    function createDialogTboss(){
      WebimService.createTboosDialog(vm.serverUserId,vm.information.customerId)
        .then(function (data) {
          //vm.creatDialogId=data.dialogId;
          //location.reload();
          $uibModalInstance.close();
        })
        .catch(function (err){
          $rootScope.catchError(err);
        });
    }
    vm.callBack = function () {
      createDialogTboss();
    };
  }

})();
