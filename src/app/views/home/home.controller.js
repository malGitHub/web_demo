/**
 * Created by linyao on 2016/5/4.
 */
(function () {
    'use strict';

    angular
        .module('WeViews')
        .controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController($rootScope,$window,Message,$interval) {
      var vm = this;
/*      $interval.cancel($rootScope.OutrescueFuncs);  //关闭外出救援每分钟刷新
      $interval.cancel($rootScope.CustomerFuncs);*/
      $rootScope.publicParames.testToken=0;
      $interval.cancel($rootScope.queryWoLoopFucs);
      $('.modal').hide();
      $('.modal-backdrop').hide();

      vm.loginName = '';
      vm.loginPwd = '';
      vm.doLogin = function () {
        if (vm.loginName == '') {
          $rootScope.loginErrorMsg="用户名不能为空";
          //Message.error("用户名不能为空");
        } else if (vm.loginPwd == '') {
          $rootScope.loginErrorMsg="密码不能为空";
          //Message.error("密码不能为空");
        } else {
          $rootScope.toLogin(vm.loginName,vm.loginPwd);
        }
      };
      vm.clearErrorMsg=function(){
        $rootScope.loginErrorMsg='';
      };
      vm.enterKeyup = function(e){
        var keycode = $window.event?e.keyCode:e.which;
        if(keycode==13){
          vm.doLogin();
        }
      };
    }
})();
