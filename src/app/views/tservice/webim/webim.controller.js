
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceWebimController', TserviceWebimController);

  /** @ngInject */
  function TserviceWebimController($scope,$compile,$rootScope,$state,$filter,$timeout,$interval, $window,$uibModal,GetTemplateUrl,GetControllerName, Message,emojiService,WebimService) {
    var vm = this;
    var onlineCount=0;
    $(function(){
      $.getScript('../../../../assets/libs/NIM_Web_NIM_v3.2.0.js',function(){
        CrmLoginWebim()
      });
    });
    var toggleIm=function () {
      vm.toperson='1';
      vm.setCurrSession();
      vm.chartbox=false;
    };
    $scope['$on']('$stateChangeStart', toggleIm);

    vm.toReload=function () {
      location.reload();
    };
    vm.prepareLoading=true;
    vm.chartbox=false;


    vm.boxTimeLoading=false;

    /*
     * 提示语
     * */
    vm.moreobject = false;

    /*
     登陆im,获取登陆者account和token*
     */
    function CrmLoginWebim(){
      WebimService.CrmQueryUserInfo($rootScope.userInfo.userId,'2')
        .then(function (data) {
          vm.userAccount=data.accountId;
          vm.userToken=data.token;
          webImScript();
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }


    /*
     * 第一次获取左侧对话用户列表
     * */
    vm.prepareLoadingTxt='加载中请稍候......';
    function LeftSessionListFirst() {
      WebimService.serviceDialogList(vm.userAccount)
        .then(function (data) {
          if(data.length==0){
            vm.prepareLoadingTxt='当前没有会话信息';
            vm.prepareLoading=true;
          }else{
            vm.prepareLoadingTxt='加载中请稍候......';
            vm.prepareLoading=false;
            vm.sessionGroup=data;
            for(var i=0;i<data.length;i++) {
              vm.sessionGroup[i].header="http://jfx.mapbar.com/usercenter/user/queryPicById?userId=" + vm.sessionGroup[i].customerId;
            }
          }
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });

      $rootScope.webimLeftInterval=$interval(function () {
        //LeftSessionList(vm.data.sessions)
        LeftSessionListInterval()
      }, 1000 * 6);
    }
    /*
     * 每分钟获取最新消息
     * */
    function LeftSessionListInterval() {
      WebimService.serviceDialogList(vm.userAccount)
        .then(function (data) {
          for(var i=0;i<data.length;i++){
            vm.sessionGroup[i].content=data[i].content
          }
        })
        .catch(function (err) {
          if (err.resultCode == 509) {
            //登录失败
            $window.sessionStorage.clear();
            $rootScope.loginErrorMsg=err.message;
            $rootScope.userInfo = null;
            $rootScope.logined = null;
            $state.go('home');
          }else {
            console.log(err)
          }
        });
    }
    /*
     * 获取左侧对话用户列表
     * */
    function LeftSessionList(unreadDate) {
      onlineCount=0;
      var hasCustomer=false;
      WebimService.serviceDialogList(vm.userAccount)
        .then(function (data) {
          if(data.length==0){
            vm.prepareLoading=true;
            vm.prepareLoadingTxt='当前没有会话信息';
          }
          else{
            vm.prepareLoading=false;
          }
          vm.sessionGroup=data;
          for(var i=0;i<data.length;i++){
            $.ajax({
              type: "GET",
              cache: false,
              async:false,
              url: "http://jfx.mapbar.com/usercenter/user/queryPicById?userId=" + vm.sessionGroup[i].customerId,
              data: "",
              success: function() {
                vm.sessionGroup[i].header = "http://jfx.mapbar.com/usercenter/user/queryPicById?userId=" + vm.sessionGroup[i].customerId;
              },
              error: function() {
                vm.sessionGroup[i].header = "assets/webim/default-icon.png";
              }
            });
            /*判断长时间未通话*/
            if(data[i].customerId===vm.toperson){
              hasCustomer=true;
            }
            if(typeof(unreadDate)=="object"){
              for(var k=0;k<unreadDate.length;k++){
                if(unreadDate[k].to==vm.sessionGroup[i].customerId){
                  vm.sessionGroup[i].msgCount=unreadDate[k].unread;
                  onlineCount=onlineCount+vm.sessionGroup[i].msgCount;
                  $rootScope.publicParames.onlineNum=onlineCount>0?'new':'';
                }
              }
            }
          }
          if (!hasCustomer) {
            vm.chartbox=false;
          }
        })
        .catch(function (err) {
          if (err.resultCode == 509) {
            //登录失败
            $window.sessionStorage.clear();
            $rootScope.loginErrorMsg=err.message;
            $rootScope.userInfo = null;
            $rootScope.logined = null;
            $state.go('home');
          }else {
            console.log(err)
          }
        });
    }
    vm.sessionGroup=[{msg:{dialogId:'',customerId:'',customerName:'',msgType:'',content:'',header:'',msgCount:''},unread:0}];

    /*
     * 结束服务
     * */
    vm.close=function () {
      Message.confirm('您是否要关闭当前会话窗口？')
        .then(function () {
          WebimService.closeDialog(vm.dialogId)
            .then(function () {
              Message.success('设置成功');
              vm.getImHistoryList();
              LeftSessionList(vm.data.sessions);
              vm.toperson='1';
              vm.setCurrSession();
              vm.chartbox=false;
            })
            .catch(function (err) {
              $rootScope.catchError(err);
            });
        });
    };
    /*
     * 超时自动关闭
     * */
    vm.cancelDialogTimeout=function () {
      cancelDialog()
    };
    function cancelDialog(){
      vm.state=vm.state=='2'?'1':'2';
      WebimService.cancelDialogTimeout(vm.dialogId,vm.state)
        .then(function () {
          Message.success('设置成功');
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }

    /*
     * 会话时间
     * */

    function timekeep(sec){
      vm.time=$interval(function () {
        var mm=0,ss=0;
        if((++sec)/60>0){
          mm=parseInt(sec/60);
          ss=sec%60;
        }else{
          sec++;
          ss=sec;
        }
        vm.howlong=mm+'分钟'+ss+'秒'
      }, 1000);
    }

    //点击id为sibader之外的地方触发
    angular.element("body").bind("click",function(e){
      if(vm.showEmoji==true){
        var target = angular.element(e.target);
        if(target.closest("#showEmoji").length == 0&&target.closest("#emojiTag").length == 0){
          $scope.$apply(function () {
            vm.showEmoji=false;
          });
        }
      }

    });

    //显示隐藏表情
    vm.toShowEmoji=function () {
      vm.showEmoji=!vm.showEmoji

    };
    /*
     im开始脚本
     */
    function  webImScript() {
      vm.toperson='1';// 默认与toperson会话
      vm.data = {};//全局data

      /*
       初始化SDK
       */
      var nim = NIM.getInstance({
        //db: false,    //关闭本地存储
        //debug: true,  //开启debug
        isHistoryable: true,//是否存储云端历史
        isRoamingable: false,//是否支持漫游
        isOfflinable:true,// 是否要存离线
        isUnreadable:true,//是否计入消息未读数
        isSyncable: true,//是否支持发送者多端同步
        //appKey: '34742e4968884821fb3f14160545c512',//正式
        appKey: '13f2d26757f7d3c9802140e735a49b37',//test
        account: vm.userAccount,
        token:  vm.userToken,
        onconnect: onConnect,
        onerror: onError,
        // onwillreconnect: onWillReconnect,
        ondisconnect: onDisconnect,  //丢失连接
        onloginportschange: onLoginPortsChange,
        onmyinfo: onMyInfo,
        onusers: onUsers,
        onupdateuser: onUpdateUser,
        onsessions: onSessions,
        onupdatesession: onUpdateSession,
        onofflinemsgs: onOfflineMsgs,
        onmsg: onMsg
        // onroamingmsgs: onRoamingMsgs
      });


      /*
       每次断开 IM，再重新连接IM
       */
      nim.connect();
      $rootScope.nimdisconnect=function () {
        nim.disconnect();
      };

      /*
       连接成功
       */
      function onConnect() {
        LeftSessionListFirst();
        /*
         文件传输
         */
        $("#chooseFileBtn").click(function(){
          $('#uploadFile').click();
        });
        $('#uploadFile').on('change', function () {
          $scope.$apply(function () {
            vm.fileInput = vm.file;
          });
          if(vm.fileInput.size==0){
            Message.error("不能传空文件");
            return
          }
          if(vm.fileInput.type.indexOf("image")==-1){
            Message.error("请上传正确的图片格式");
            return
          }

          nim.sendFile({
            scene: 'p2p',
            to: vm.toperson,
            type: 'image',
            custom: '{"dialogId":"'+vm.dialogId+'"}',
            fileInput:$("#uploadForm").find('input').get(0),
            beginupload: function(upload) {
              // - 如果开发者传入 fileInput, 在此回调之前不能修改 fileInput
              // - 在此回调之后可以取消图片上传, 此回调会接收一个参数 `upload`, 调用 `upload.abort();` 来取消文件上传
            },
            uploadprogress: function(obj) {
              console.log('文件总大小: ' + obj.total + 'bytes');
              console.log('已经上传的大小: ' + obj.loaded + 'bytes');
              console.log('上传进度: ' + obj.percentage);
              console.log('上传进度文本: ' + obj.percentageText);
            },
            uploaddone: function(error, file) {
              if(error){
                Message.error(error.message);
              }
              console.log('上传' + (!error?'成功':'失败'));
            },
            beforesend: function(msg) {
              console.log('正在发送p2p image消息, id=' + msg.idClient);
            },
            done: sendFileDone
          });

          function sendFileDone(error, msg) {
            if(error){
              console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient);
            }else{
              console.log("发送的消息",msg);
              pushMsgIm(msg);
            }
          }

        });

        /*
         *回车发送操作
         */
        $("#messageText").keydown(function(evt) {
          evt = (evt) ? evt : ((window.event) ? window.event : ""); //兼容IE和Firefox获得keyBoardEvent对象
          var key = evt.keyCode?evt.keyCode:evt.which; //兼容IE和Firefox获得keyBoardEvent对象的键值
          if (key == "13") {//keyCode=13是回车键
            if(vm.toperson==''){
              Message.error("您没在对话中")
            }else if($("#messageText").val()==''){
              Message.error("发送内容不能为空，请重新输入");
              return false
            }else{
              getMessageText();
            }
          }
        });

        /*
         button发送操作
         */
        vm.sendText=function () {
          if(vm.toperson==''){
            Message.error("您没在对话中")
          }else if($("#messageText").val()==''){
            Message.error("发送内容不能为空，请重新输入");
          }else{
            getMessageText();
          }
        };

        /*
         发送消息前配置(通过云信)
         */
        function getMessageText(){
          var txt=angular.element("#messageText").val();
          angular.element("#messageText").val("");
          var msg = nim.sendText({
            scene: 'p2p',
            to: vm.toperson,
            text: txt,
            file:vm.fileInput,
            custom: '{"dialogId":"'+vm.dialogId+'"}',
            done: sendMsgDone
          });
        }

        /*
         发送消息
         */
        function sendMsgDone(error, msg) {
          $("#messageText").val("");
          if(error){
            console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient);
          }else{
            pushMsgIm(msg);
          }
        }
      }

      function getHistoryMsgsDone(error,obj,push) {
        if (!error) {
          if(push=='push'){
            angular.element('#chatContent').html("");
            var arr=obj.msgs;
            var arr=arr.reverse();
            for(var i=arr.length-1;i>0||i==0;i--){
              if(i!=0){
                var lastTime=arr[i-1].time;
                if((lastTime-arr[i].time)>5*60*1000){
                  var appendTime='<p class="u-msgTime">- - - - -&nbsp;'+new Date(parseInt(arr[i].time)).toLocaleString()+'&nbsp;- - - - -</p>';
                  angular.element('#chatContent').append(emojiService.buildEmoji(appendTime));

                }
              }else{
                var appendTime='<p class="u-msgTime">- - - - -&nbsp;'+new Date(parseInt(arr[i].time)).toLocaleString()+'&nbsp;- - - - -</p>';
                angular.element('#chatContent').append(emojiService.buildEmoji(appendTime));

              }
              pushYunMsg(obj.msgs[i]);
            }
          }
        }else{
          console.log('获取p2p历史消息' + (!error?'成功':'失败'));
        }
      }

      /*
       *会话详情
       */
      function getDialogDetail() {
        WebimService.dialogDetail(vm.dialogId,vm.userAccount)
          .then(function (data) {
            $interval.cancel(vm.time);
            timekeep(parseInt((new Date()-data.createTime)/1000));
            vm.object=data;
            vm.object.msgs=data.list;
            vm.personNickname=data.nickName;
            vm.state=data.autoClose;
            getHistoryMsgsDone("", data,'push');
            //时间计时
            vm.chartbox=true;
            document.getElementById('chatContent').scrollTop = document.getElementById('chatContent').scrollHeight;
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          });
      }
      /*
       *用户、客服会话查询
       */
      function getDialogid() {
        vm.dialogNum=1;vm.dialogSize=1;
        WebimService.dialogSearch(vm.toperson,vm.userAccount,vm.dialogNum,vm.dialogSize)
          .then(function (data) {
            getDialogDetail();
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          });
      }
      /*
       *收到漫游消息
       */
      function onRoamingMsgs(obj) {
        console.log('收到漫游消息', obj);
      }
      /*
       此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
       */
      function onWillReconnect(obj) {
        console.log(obj,"正在重新建立连接");
        $scope.$apply(function () {
          vm.prepareLoadingTxt='连接断开,即将重连......';
        });
        vm.prepareLoading=true;
        console.log('正在尝试第'+obj.retryCount+'次重连',obj);
      }

      /*
       此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
       */
      function onDisconnect(error) {
        console.log(error);
        $("#contacting").html('丢失连接');
        if (error) {
          switch (error.code) {
            // 账号或者密码错误, 请跳转到登录页面并提示错误
            case 302:
              Message.error(error.message);
              break;
            // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
            case 417:
              break;
            // 被踢, 请提示错误后跳转到登录页面
            case 'kicked':
              break;
            default:
              break;
          }
        }
      }

      /*
       发生错误
       */
      function onError(error) {
        console.log(error);
      }

      /*
       当前登录帐号在其它端的状态发生改变了
       */
      function onLoginPortsChange(loginPorts) {
        console.log('当前登录帐号在其它端的状态发生改变了', loginPorts);
      }

      /*
       收到我的名片
       */
      function onMyInfo(user) {
        console.log('收到我的名片', user);
        $scope.$apply(function () {
          vm.data.myInfo = user;
          vm.username=user.nick;
        });
        $('#myname').html(user.nick);
      }

      /*
       收到用户名片列表
       */
      function onUsers(users) {
        console.log('收到用户名片列表',users);
        $scope.$apply(function () {
          vm.data.users = nim.mergeUsers(vm.data.users, users);
        });

        if(users[0]){
          $('#myfirend').html(users[0].nick)
        }
      }

      /*
       用户名片更新了
       */
      function onUpdateUser(user) {
        $scope.$apply(function () {
          vm.data.users = nim.mergeUsers(vm.data.users, user);
        });
      }

      /*
       收到会话列表
       */
      function onSessions(sessions) {
        vm.data.sessions = nim.mergeSessions(vm.data.sessions, sessions);
        LeftSessionList(vm.data.sessions);
      }


      /*
       会话更新了
       */
      function onUpdateSession(session) {
        if(session.lastMsg.custom!=undefined){
          if(session.lastMsg.custom.dialogState!=undefined){
            vm.getImHistoryList();
            if(vm.toperson==session.to){
              vm.toperson='1';
              vm.chartbox=false;
              vm.setCurrSession();
            }
            LeftSessionList(vm.data.sessions);
          }
        }
        vm.data.sessions = nim.mergeSessions(vm.data.sessions, session);
        LeftSessionList(vm.data.sessions);
      }
      function updateSessionsUI(sessions) {

      }

      /*
       离线消息
       */
      function onOfflineMsgs(obj) {
        pushMsgIm(obj.msgs);
      }

      /*
       收到消息
       */
      function onMsg(msg){
        if(vm.toperson==msg.from){      //判断是否为当前对话
          pushMsgIm(msg);
        }
      }
      /*
       同步完成
       */
      function onSyncDone() {
        console.log('同步完成');
      }
      /*
       * url转MP3
       * */
      function toMp3Url(url) {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        if ((userAgent.indexOf("Firefox") > -1)||(userAgent.indexOf("Trident") > -1)) {//判断是否Firefox或者ie浏览器
          var mp3Url = nim.audioToMp3({
            url: url
          });
          return mp3Url
        }else{
          return url
        }
      }

      /*
       添加（云信返回的）消息到对话框
       */
      function pushMsgIm(msgs) {
        var who='';
        var appendhtml='';
        if(msgs.flow=='out'){
          who="me"
          var baseStart='<div class="item item-'+who+'"> <p class="nametime" data-time="'+msgs.time+'"></p><img class="img j-img" src="assets/webim/serviceperson.png"><div class="msg msg-text j-msg">';
        }else{
          who="you";
          var baseStart='<div class="item item-'+who+'"> <p class="nametime" data-time="'+msgs.time+'"></p><img class="img j-img" src="'+vm.headPic+'" onerror="onerror=null;src=\'assets/webim/default-icon.png\'"><div class="msg msg-text j-msg">';
        }
        var lastPushTime=parseInt($("#chatContent .item").last().find(".nametime").attr("data-time"));
        if((msgs.time-lastPushTime)>5*60*1000){
          var appendTime='<p class="u-msgTime">- - - - -&nbsp;'+new Date(parseInt(msgs.time)).toLocaleString()+'&nbsp;- - - - -</p>';
          $('#chatContent').append(appendTime);
        }
        var msgTime=new Date(parseInt(msgs.time)).toLocaleString();
        var baseEnd='</div></div>';
        /*添加html*/
        if(msgs.type=='text'){
          appendhtml=baseStart+'<div class="box"><div class="cnt"><div class="f-maxWid">'+msgs.text+'</div></div></div>'+baseEnd;
        }else if(msgs.type=='image'){
          appendhtml=baseStart+'<div class="box"><div class="cnt"><a href="'+msgs.file.url+'" target="_blank"><img  onload="loadImgWebim()" onerror="'+msgs.file.url+'" src="'+msgs.file.url+'"></a></div></div>'+baseEnd;
        }else if(msgs.type=='audio'){
          appendhtml=baseStart+'<audio preload="preload" src="'+toMp3Url(msgs.file.url)+'" onloadedmetadata="loadImgWebim()" controls="controls"></audio>'+baseEnd;
        }else if(msgs.type=='video'){
          appendhtml=baseStart+'<video src="'+msgs.file.url+'" onloadedmetadata="loadImgWebim()" controls="controls"></video>'+baseEnd;
        }else{
          appendhtml=baseStart+'<div class="box"><div class="cnt"><div class="f-maxWid">'+msgs.text+'</div></div></div>'+baseEnd;
        }

        $('#chatContent').append($compile(emojiService.buildEmoji(appendhtml))($scope));
        document.getElementById('chatContent').scrollTop = document.getElementById('chatContent').scrollHeight;//滚动至滚动条底部

        /*添加数据到data*/
        if (!Array.isArray(msgs)) { msgs = [msgs]; }
        var sessionId = msgs[0].sessionId;
        $scope.$apply(function () {
          vm.data.msgs = vm.data.msgs || {};
          vm.data.msgs[sessionId] = nim.mergeMsgs(vm.data.msgs[sessionId], msgs);
        });
      }

      /*
       添加（接口返回的）消息到对话框
       */
      function pushYunMsg(msgs) {
        var who='';
        var appendhtml='';
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
        if(msgs.type=='TEXT'){
          appendhtml=baseStart+'<div class="box"><div class="cnt"><div class="f-maxWid">'+msgs.content+'</div></div></div>'+baseEnd;
        }else if(msgs.type=='PICTURE'){
          appendhtml=baseStart+'<div class="box"><div class="cnt"><a href="'+msgs.content+'" target="_blank"><img  onload="loadImgWebim()" onerror="'+msgs.content+'" src="'+msgs.content+'"></a></div></div>'+baseEnd;
        }else if(msgs.type=='AUDIO'){
          appendhtml=baseStart+'<audio preload="preload" src="'+toMp3Url(msgs.content)+'"  onloadedmetadata="loadImgWebim()" controls="controls"></audio>'+baseEnd;
        }else if(msgs.type=='VIDEO'){
          appendhtml=baseStart+'<video src="'+msgs.content+'"  onloadedmetadata="loadImgWebim()" controls="controls"></video>'+baseEnd;
        }else{
          appendhtml=baseStart+'<div class="box"><div class="cnt">'+msgs.content+'</div></div>'+baseEnd;
        }
        $('#chatContent').append($compile(emojiService.buildEmoji(appendhtml))($scope));
        document.getElementById('chatContent').scrollTop = document.getElementById('chatContent').scrollHeight;//滚动至滚动条底部

        /*添加数据到data*/
        if (!Array.isArray(msgs)) { msgs = [msgs]; }
        var sessionId = msgs[0].sessionId;
        vm.data.msgs = vm.data.msgs || {};
        vm.data.msgs[sessionId] = nim.mergeMsgs(vm.data.msgs[sessionId], msgs);
      }

      vm.gethistoryText=function(array){
        vm.historyPageNumber=0;//历史页数值设置为0
        vm.boxTimeLoading=false;//loading 图片去掉
        vm.dialogId=array.dialogId;  //切换右侧列表得到会话id
        vm.toperson= array.customerId;
        vm.headPic="http://jfx.mapbar.com/usercenter/user/queryPicById?userId="+array.customerId;
        //获取聊天记录
        nim.setCurrSession('p2p-'+vm.toperson);
        nim.resetSessionUnread('p2p-'+vm.toperson);
        clearmessageText();
        getDialogDetail();//得到接口会话内容
      };
      function clearmessageText(){  //将输入框清空
        $("#messageText").val("");
      }

      /*
       * 设置当前对话
       * */
      vm.setCurrSession=function () {
        nim.setCurrSession('p2p-'+vm.toperson);
      };

      /*
       *表情
       */
      vm.showEmoji=false;
      /*定义表情对象*/
      vm.emoji=emojiService.faceEmoji();
      /*添加表情到文本框*/
      vm.putEmoji=function (params) {
        var basse=$("#messageText").val();
        $("#messageText").val(basse+params);
        vm.showEmoji=!vm.showEmoji;
        $("#messageText").focus();
      };

      /*
       * 滚动滚轮监听事件
       * */
      function addEvent(obj,xEvent,fn) {
        if(obj.attachEvent){
          obj.attachEvent('on'+xEvent,fn);
        }else{
          obj.addEventListener(xEvent,fn,false);
        }
      }
      /*
       * 取消滚动滚轮监听事件
       * */
      function removeEvent(target, type, func){
        if (target.removeEventListener)
          target.removeEventListener(type, func, false);
        else if (target.detachEvent)
          target.detachEvent("on" + type, func);
        else target["on" + type] = null;
      };
      /*
       * 滚动滚轮查看历史
       * */
      var oDiv = document.getElementById('chatContent');
      addEvent(oDiv,'mousewheel',onMouseWheel);
      addEvent(oDiv,'DOMMouseScroll',onMouseWheel);
      // 当滚轮事件发生时，执行onMouseWheel这个函数
      vm.historyPageNumber=0;
      vm.historyPageSize=1;
      function onMouseWheel(event) {
        event = event || window.event;
        if(((event.wheelDelta > 110)||(event.detail < -1))&&document.getElementById('chatContent').scrollTop == 0 ){
          vm.boxTimeLoading=true;
          removeEvent(oDiv,'mousewheel',onMouseWheel);
          removeEvent(oDiv,'DOMMouseScroll',onMouseWheel);
          vm.historyTimeout = $timeout(function () {
            vm.historyPageNumber++;
            lookforDialogId()
          }, 1000 *1.5);
        }
      }


      function lookforDialogId(){
        WebimService.dialogSearchId(vm.toperson,vm.userAccount,vm.historyPageNumber,vm.historyPageSize)
          .then(function(data){
              if(data.list.length!=0){
                WebimService.dialogDetail(data.list[0].dialogid,vm.userAccount)
                  .then(function(data){
                      var arr=data.list;
                      var arrLength=data.list.length-1;
                      var prependTxt='<p class="u-msgTime">- - - - -&nbsp;'+new Date(parseInt(data.list[arrLength].time)).toLocaleString()+'&nbsp;- - - - -</p><p class="u-msgHistory">以上为历史记录</p>';
                      $('#chatContent').prepend(prependTxt);
                      for(var i=arr.length-1;i>0||i==0;i--){
                        pushMoreMsg(data.list[i]);
                      }
                      var  dtc=$(".u-msgHistory:eq(0)").offset().top;   //某dom的位置
                      document.getElementById('chatContent').scrollTop = dtc;
                      vm.boxTimeLoading=false;
                      addEvent(oDiv,'mousewheel',onMouseWheel);
                      addEvent(oDiv,'DOMMouseScroll',onMouseWheel);
                    }
                  ).catch(function(err){
                  $rootScope.catchError(err);
                });
              }else{
                vm.boxTimeLoading=false;
                Message.error("没有更多历史内容了");
                $timeout(function(){
                  addEvent(oDiv,'mousewheel',onMouseWheel);
                  addEvent(oDiv,'DOMMouseScroll',onMouseWheel);
                },2000);
              }
            }
          ).catch(function(err){
          $rootScope.catchError(err);
        });
      }

      /*
       添加（接口返回的）历史消息到对话框
       */
      function pushMoreMsg(msgs) {
        var who='';
        var appendhtml='';
        if(msgs.flow=='out'){
          who="me";
          var baseStart='<div class="item item-'+who+'"> <p class="nametime" data-time="'+msgs.time+'"></p><img class="img j-img" src="assets/webim/serviceperson.png"><div class="msg msg-text j-msg">';
        }else{
          who="you";
          var baseStart='<div class="item item-'+who+'"> <p class="nametime" data-time="'+msgs.time+'"></p><img class="img j-img" src="'+vm.headPic+'"  onerror="onerror=null;src=\'assets/webim/default-icon.png\'"><div class="msg msg-text j-msg">';
        }
        var msgTime=new Date(parseInt(msgs.time)).toLocaleString();
        var baseEnd='</div></div>';
        /*添加html*/
        if(msgs.type=='TEXT'){
          appendhtml=baseStart+'<div class="box"><div class="cnt"><div class="f-maxWid">'+msgs.content+'</div></div></div>'+baseEnd;
        }else if(msgs.type=='PICTURE'){
          appendhtml=baseStart+'<div class="box"><div class="cnt"><a href="'+msgs.content+'" target="_blank"><img onerror="'+msgs.content+'" src="'+msgs.content+'"></a></div></div>'+baseEnd;
        }else if(msgs.type=='AUDIO'){
          appendhtml=baseStart+'<audio preload="preload" src="'+toMp3Url(msgs.content)+'" controls="controls"></audio>'+baseEnd;
        }else if(msgs.type=='VIDEO'){
          appendhtml=baseStart+'<video src="'+msgs.content+'" controls="controls"></video>'+baseEnd;
        }else{
          appendhtml=baseStart+'<div class="box"><div class="cnt">'+msgs.content+'</div></div>'+baseEnd;
        }
        $('#chatContent').prepend(emojiService.buildEmoji(appendhtml));
      }
      /*end*/

      /*查看历史*/
      vm.item=function(code,customerName,startTime,endTime,customerId){
        //获取登陆者账户Id
        WebimService.CrmQueryUserInfo($rootScope.userInfo.userId,'2')
          .then(function (data) {
            vm.serverUserId=data.accountId;
            getDialogSearchId()
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          });
        //获取会话Id，用户Id
        function getDialogSearchId(){
          WebimService.dialogSearchId('','','1','')
            .then(function () {
              vm.dialogIdHistorry=code;
              getDetailHistory();
            })
            .catch(function (err) {
              $rootScope.catchError(err);
            });
        }


        //获取历史会话详情
        function getDetailHistory(){
          var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
          var explore=(userAgent.indexOf("Firefox") > -1)||(userAgent.indexOf("Trident") > -1);
          WebimService.dialogDetailAll(vm.dialogIdHistorry,vm.serverUserId)
            .then(function (data) {
              vm.getHistoryMsgs=data;
              for(var i=0;i<vm.getHistoryMsgs.list.length;i++){
                if(vm.getHistoryMsgs.list[i].type=="AUDIO"&&explore){
                  vm.getHistoryMsgs.list[i].content = nim.audioToMp3({
                    url: vm.getHistoryMsgs.list[i].content
                  });
                }
              }
              openHistory();
            })
            .catch(function (err) {
              $rootScope.catchError(err);
            });
        }


        function openHistory() {
          $uibModal.open({
            templateUrl:GetTemplateUrl('tservice.webim.history'),
            controller: GetControllerName('tservice.webim.history'),
            controllerAs: 'vm',
            windowClass: 'tservice-webim-small-history',
            resolve:{        //传参
              code:function(){return code},
              customerName:function(){return customerName},
              startTime:function(){return startTime},
              endTime:function(){return endTime},
              customerId:function(){return customerId},
              getHistoryMsgs:function(){return vm.getHistoryMsgs}
            },
            backdrop:false
          }).result.then(function () {
            location.reload();
          });
        }
      };

    }

    /**********************************历史记录*************************************************/
    //获取时间
    vm.query={
      customerName:"",
      startTime:"",
      endTime:"",
      customerId:""
    };

    vm.historyBox=function(id){
      console.log('code',id);
    };

    //------------------select框获取时间段---------------------


    //自定义时间消失和隐藏
    vm.myVar = false;
    function toggle(){
      vm.myVar = !vm.myVar;
    }
    vm.timeHistoryType="7";
    vm.historyTime=[{key:'',value:'全部'},{key:'0',value:'今天'},{key:'7',value:'最近7天'},{key:'30',value:'最近30天'},{key:'00',value:'自定义'}];

    //select框选择历史记录的时间
    vm.changeDate = function(){
      vm.page_number=1;
      vm.page_size=10;
      var day =  vm.timeHistoryType;
      if(vm.timeHistoryType=="00"){
        toggle();
      }else{
        vm.myVar = false;
        if(vm.timeHistoryType==""){
          vm.query.startTime="";
          vm.query.endTime="";
          vm.getImHistoryList();
        }else
        {
          vm.DateChange(day);
          vm.getImHistoryList();
        }
      }
    };
    vm.DateChange = function(day){
      var endTime = new Date();
      var startTime = new Date(endTime.getTime() - day*60*24*60*1000);
      vm.query.startTime=$filter('date')(startTime, 'yyyy-MM-dd');
      vm.query.endTime=$filter('date')(endTime, 'yyyy-MM-dd');
    };

    //获取对话列表
    vm.DateChange('7');

    vm.page_number=1;
    vm.page_size=10;
    vm.getImHistoryList=function(){
      WebimService.customerDialogPageList(vm.page_number,vm.page_size,vm.query)
        .then(function(data){
            vm.imInfor=data.list;
            vm.total = data.total;
          }
        ).catch(function(err){
        $rootScope.catchError(err);
      });
    };
    vm.getImHistoryList();

    vm.flip = function (page_number) {
      vm.page_number = page_number;
      vm.getImHistoryList();
    };
  }
})();

