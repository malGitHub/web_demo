(function () {

    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceCashinfoController', TserviceCashinfoController);
    /** @ngInject */
    function TserviceCashinfoController($state,$timeout, $stateParams,Message,$uibModal, $rootScope,$window, CashService,GetTemplateUrl,GetControllerName) {
        //构造方法
        var vm = this;
        vm.title ="兑换详情";
        vm.id = $stateParams.id;
        vm.actId = $stateParams.actId;
        vm.stationType = $stateParams.sType;
        //分页相关
        vm.pageIndex = 1;
        vm.pageSize = 10;
       vm.nowDate=new Date();
       vm.query={};
      //根据条件查询获取列表
      vm.getGrantditDdata=function () {
        CashService.getExchangeStationRecordList(vm.id,vm.actId,vm.stationType,vm.keyWord,vm.exchangeStartTime,vm.exchangeEndTime,vm.pageIndex,vm.pageSize)
          .then(function (data) {
            vm.query = data;
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          });
      };
        //初始化查询获取列表
        vm.getGrantditDdata();

        vm.flip = function () {
            vm.getGrantditDdata();
        };

        //返回按钮
        vm.cancel = function () {
          $state.go('tservice.cashdit',{'id':vm.actId});
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
        CashService.getExeclLinkNext(email,vm.id,vm.actId,vm.stationType,vm.keyWord,vm.exchangeStartTime,vm.exchangeEndTime,vm.pageIndex,vm.pageSize)
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
                templateUrl: GetTemplateUrl('tservice.cashinfo.email'),
                controller: GetControllerName('tservice.cashinfo.email'),
                controllerAs: 'vm',
                backdrop: false,
                resolve: {
                  id: function () {return vm.id;},
                  actId: function () {return vm.actId;},
                  stationType: function () {return vm.stationType;},
                  keyWord: function () {return vm.keyWord;},
                  exchangeStartTime: function () {return vm.exchangeStartTime;},
                  exchangeEndTime: function () {return vm.exchangeEndTime;},
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

