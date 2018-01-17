(function () {
  'use strict';

  angular
    .module('wedriveOperationPlatform')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, $state, $timeout,$interval,
                    $window, Message, CommonService,
                    SsoService, $uibModal,GetTemplateUrl,GetControllerName) {

    $log.log('angular run');

    var isAngularInit = false;

    var hrefString=$window.location.href.split("#")[0];
    $rootScope.host = hrefString.substring(0,hrefString.length-1);


    function init(thenFun) {
      //是否登录判定
      CommonService.getDeveloper($window.sessionStorage.getItem("token")).then(function (userInfo) {
        //登录成功
        $rootScope.logined = true;
        $rootScope.userInfo = userInfo;
        $rootScope.userInfo.token = $window.sessionStorage.getItem("token");
        $timeout(function () {
          init(function () {
            roleFilter(null, $state.current, $state.params);
          });
        }, 1000 * 60 * 60 * 6);
      }, function (error) {
        console.log(error,"error");
        //登录失败
        $rootScope.logined = false;
        if (error && error.code === 500) {
          Message.error('网络或服务器错误，请稍后重试');
        }
      }).finally(function () {
        //finally 方法
        isAngularInit = true;
        thenFun && thenFun();
      });
    }

    // init();



    var stateChangeStart = function (evt, toState, toParams) {
      $log.log('$stateChangeStart:' + toState.name);
      $interval.cancel($rootScope.interval);
      $interval.cancel($rootScope.OutrescueInterval);
      $interval.cancel($rootScope.CustomerInterval);
      $interval.cancel($rootScope.DealorderInterval);
      $interval.cancel($rootScope.webimLeftInterval);

      if($rootScope.logined !== undefined || toState.name !== 'loading') {
        //如果angular未初始化完成（刷新时等情况）
        if (!isAngularInit) {

          init(function () {
            roleFilter(evt, toState, toParams, true);
          });

          evt.preventDefault();

          $state.go('loading', null, {
            location : 'replace'
          });
        } else if($rootScope.logined){  //添加是否登陆判读
          var flg = false;
          for (var i=0;i<$rootScope.userInfo.routes.length;i++) {
            if (toState.name.indexOf($rootScope.userInfo.routes[i]) === 0) {
              flg = true;
              roleFilter(evt, toState, toParams);
              break;
            }
          }
          if (!flg) {
            $rootScope.logout();
          }
        }else{
          roleFilter(evt, toState, toParams);
        }
      }
    }, stateChangeSuccess = function (evt, toState) {
      $log.log('$stateChangeSuccess:' + toState.name);
      $rootScope.state = toState.name;
    };

    $rootScope['$on']('$stateChangeStart', stateChangeStart);

    $rootScope['$on']('$stateChangeSuccess', stateChangeSuccess);

    function roleFilter(evt, toState, toParams, isPreventDefault) {
      //目前没有权限  前端暂定 登录的为1 未登录的为0
      var role = $rootScope.logined ? 1 : 0,

        //用户可以访问的权限
        roleState,
        //权限对应的默认页面
        roleToState;

      switch (role){
        case 1:
          roleState = ['tservice','aboutus'];
          roleToState = 'tservice';
          break;
        default:
          roleState = ['home','aboutus'];
          roleToState = 'home';
      }

      if(toState){
        //如果权限不符，则跳转到对应权限首页
        if(
          roleState.every(function (state) {
            return toState.name.indexOf(state) !== 0
          })
        ){
          evt.preventDefault();
          $state.go(roleToState, null, {
            location : 'replace'
          });
        } else if(isPreventDefault) {
          var flg = true;
          if($rootScope.logined){  //添加是否登陆判读
            for (var i=0;i<$rootScope.userInfo.routes.length;i++) {
              if (toState.name.indexOf($rootScope.userInfo.routes[i]) !== 0) {
                flg = false;
                $state.go(toState.name, toParams, {
                  location : 'replace'
                });
              }
            }
            if (flg) {
              $rootScope.logout();
            }
          }else{    //如果未登录，按原路由跳转
            $state.go(toState.name, toParams, {
              location : 'replace'
            });
          }

        }
      }else{
        //如果未指定跳转state，则跳转到对应权限首页
        $state.go(roleToState, null, {
          location : 'replace'
        });
      }
    }

    $rootScope['$on']('user:invalid', function () {
      if (!isAngularInit) return;
      Message.error('登陆超时');
      Message.disable(true);
      $rootScope.userInfo = null;
      $rootScope.logined = null;
      console.log('登陆超时run');
      $timeout(function () {
        toHome();
      }, 1000);
    });

    $rootScope['$on']('user:norole', function () {
      Message.alert('权限不足，请联系管理员！');
      // todo: 应该跳转到其他界面
    });


    $rootScope.logout = function () {
      if( typeof $rootScope.nimdisconnect === 'function' ){
        $rootScope.nimdisconnect();//云信退出
      }
      SsoService.logout().then(function () {
        $window.sessionStorage.clear();
        Message.success('退出');
        $timeout(function () {
          $rootScope.userInfo = null;
          $rootScope.logined = null;
          //toLogin();
          toHome();
        }, 1000);
      }, function (error) {
        $window.sessionStorage.clear();
        Message.success('退出');
        $timeout(function () {
          $rootScope.userInfo = null;
          $rootScope.logined = null;
          //toLogin();
          toHome();
        }, 1000);
      })
    };
    $rootScope.errorMsg="";
    $rootScope.toLogin = function (loginName, loginPwd) {
      // $window.location.href = ssoConfig.loginUrl + encodeURIComponent($location.absUrl());
      SsoService.login(loginName,loginPwd).then(function (data) {
        console.log("登录成功");
        $rootScope.loginErrorMsg='';
        $window.sessionStorage.setItem("token",data.token);
        // var hrefString=$window.location.href.split("#")[0];
        //$window.location.href = $window.location.protocol + "//" + $window.location.host
        $window.location.href = $rootScope.host;
      }, function (error) {
        //登录失败
        $rootScope.logined = false;
        $rootScope.loginErrorMsg=error.message;
      })
    };

    /**
     * 修改密码
     */
    $rootScope.settings = function () {
      $uibModal.open({
        templateUrl: GetTemplateUrl('settings'),
        controller: GetControllerName('settings'),
        controllerAs: 'vm',
        windowClass: 'tservice-user-small-useradd.modal-dialog',
        backdrop: false
      }).result.then(function (result) {
      });
    };

    function toHome() {
      // alert(1)
      $state.go('home');
    }

    $rootScope.messageError = function(err, message) {
      if (err.resultCode == 509) {
        tokenCount(err)
      }else{
        Message.error(message);
      }
    };
    $rootScope.catchError = function(err) {
      if (err.resultCode == 509) {
        tokenCount(err)
      }else if(err.resultCode === 507) {
        Message.error(err.message);
      } else {
        Message.error('网络或服务器错误，请稍后重试');
      }
    };
    $rootScope.consoleError=function (err) {
      if (err.resultCode == 509) {
        tokenCount(err)
      }else {
       console.log(err);
      }
    };
    function tokenCount(err){
      $rootScope.publicParames.testToken++;
      if($rootScope.publicParames.testToken>10){
        //登录失败
        if( typeof $rootScope.nimdisconnect === 'function' ){
          $rootScope.nimdisconnect();//云信退出
        }
        $window.sessionStorage.clear();
        $rootScope.loginErrorMsg=err.message;
        $rootScope.userInfo = null;
        $rootScope.logined = null;
        toHome();
      }else{
        return false;
      }
    }
    /*定义全局变量*/
    $rootScope.publicParames={
      onlineNum:'',
      testToken:0
  }


  }

})();
