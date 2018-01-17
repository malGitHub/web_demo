(function () {

    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceGrantinfoController', TserviceGrantinfoController);
    /** @ngInject */
    function TserviceGrantinfoController($state, $stateParams,$rootScope, Message, GrantService,$window,$uibModal,GetTemplateUrl,GetControllerName,$timeout) {
        //构造方法
        var vm = this;
        vm.title ="发放详情";
        vm.id = $stateParams.id;
        vm.actId = $stateParams.actId;
        vm.stationType = $stateParams.sType;
        //分页相关
        vm.pageIndex = 1;
        vm.pageSize = 10;
        vm.query={};
        vm.nowDate=new Date();
        vm.flip = function () {
          vm.grantList();
        };
      vm.grantList=function () {
        GrantService.getGrantStationRecordList(vm.id,vm.actId,vm.stationType,vm.keyWord,vm.grantStartTime,vm.grantEndTime,vm.pageIndex, vm.pageSize)
          .then(function (data) {
             vm.query = data;
           })
          .catch(function (err) {
            Message.error(err.message);
          });
      };

      vm.flip();

        //返回按钮
        vm.cancel = function () {
          $state.go('tservice.grantdit',{'id':vm.actId});
        };

      vm.unitTool = function(count){
        if(count.match(/^-?[0-9]+$/) == count){
          return true;
        }else{
          return false;
        }
      }
      /*导出*/
      vm.getExecl=function () {
        var email='';
        GrantService.getExeclLinkNext(email,vm.id,vm.actId,vm.stationType,vm.keyWord,vm.grantStartTime,vm.grantEndTime,vm.pageIndex, vm.pageSize)
          .then(function(data){
             //window.open(data);
            Message.success("正在导出，请稍后");
            $timeout(function() {
              $window.location.href=data;
            },1000*10);
          })
          .catch(function(err){
            if(err.resultCode==530){
              $uibModal.open({
                templateUrl: GetTemplateUrl('tservice.grantdit.email'),
                controller: GetControllerName('tservice.grantdit.email'),
                controllerAs: 'vm',
                backdrop: false,
                resolve: {
                  id: function () {return vm.id;},
                  actId: function () {return vm.actId;},
                  stationType: function () {return vm.stationType;},
                  keyWord: function () {return vm.keyWord;},
                  grantStartTime: function () {return vm.grantStartTime;},
                  grantEndTime: function () {return vm.grantEndTime;},
                  pageIndex: function () {return vm.pageIndex;},
                  pageSize: function () {return vm.pageSize;}
                }
              })
            }else{
              $rootScope.catchError(err);
            }
          })
      }
    }
})();

