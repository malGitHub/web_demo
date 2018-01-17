(function () {
    'use strict';
    angular
        .module('WeViews')
        .controller('TserviceRoleRoleaddController', TserviceRoleRoleAddController);
    /**
     *
     * @param $uibModalInstance
     * @param RuleService
     * @constructor
     * @param Message
     */
    function TserviceRoleRoleAddController($rootScope,$uibModalInstance, RuleService) {
        var vm = this;
        vm.allCheckArray=[];
      vm.buessinesList=[];
      vm.systemList=[];
      vm.sourceAuthList=[];
      vm.marketList=[];
      vm.subscribeList=[];


      //判断是否选择复选框
        vm.checkRequest=false;
        vm.checkIt=function (object) {
          if(getFuncIds()!=""){
            vm.checkRequest=true;
          }else{
            vm.checkRequest=false;
          }
          object.checked=!object.checked;
          // vm.forAllChectFunc();
        };
      //标题相关
        vm.title = "角色信息";
        vm.function = "功能权限";

        //添加内容
        vm.applyUserPhone = '';
        vm.backUp = '';

        //业务支撑复选框
        vm.buessinesList = null;
        vm.allBuessinesChoosed = false;
        vm.hasBuessinesChoosed = false;

        //系统设置复选框
        vm.systemList = null;
        vm.allSystemChoosed = false;
        vm.hasSystemChoosed = false;

        //货源会员认证复选框
        vm.sourceAuthList = null;
        vm.allSourceChoosed = false;
        vm.hasSourceChoosed = false;

        //市场推广复选框
        vm.marketList = null;
        vm.allMarketChoosed = false;
        vm.hasMarketChoosed = false;

        //服务预约管理复选框
        vm.subscribeList = null;
        vm.allSubscribeChoosed = false;
        vm.hasSubscribeChoosed = false;

        //初始化获取业务支撑复选框值
        getBuessinesList();

        //初始化获取系统设置复选框值
        getsystemListList();

        //初始化货源会员认证设置复选框
        getSourceAuthList();

        //初始化市场推广设置复选框
        getMarketList();

        //初始化服务预约管理复选框
        getSubscribeList();

        //获取业务支撑复选框值
        function getBuessinesList() {
            RuleService.qyeryFuncList("1")
                .then(function (data) {
                    vm.buessinesList = data.list;
                })
                .catch(function (err) {
                  $rootScope.catchError(err);
                });
        }

        //获取系统设置复选框值
        function getsystemListList() {
            RuleService.qyeryFuncList("2")
                .then(function (data) {
                    vm.systemList = data.list;
                })
                .catch(function (err) {
                  $rootScope.catchError(err);
                });
        }

        //获取货源会员认证
        function getSourceAuthList() {
          RuleService.qyeryFuncList("3")
            .then(function (data) {
              vm.sourceAuthList = data.list;
            })
            .catch(function (err) {
              $rootScope.catchError(err);
            });
        }

        //获取市场推广
        function getMarketList() {
          RuleService.qyeryFuncList("16")
            .then(function (data) {
              vm.marketList = data.list;
            })
            .catch(function (err) {
              $rootScope.catchError(err);
            });
        }

      //获取服务预约管理
      function getSubscribeList() {
        RuleService.qyeryFuncList("19")
          .then(function (data) {
            vm.subscribeList = data.list;
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          });
      }

        //取消按钮
        vm.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };

        // 全选业务支撑单击事件
        vm.chooseBuessinesAll = function (evt) {
          var choose = vm.allBuessinesChoosed = vm.hasBuessinesChoosed = evt.target.checked;
            vm.buessinesList.forEach(function (item) {
                item.checked = choose;
              //判断是否选择复选框
                /*if(choose){
                  vm.checkRequest=true;
                }else{
                   vm.checkRequest=false;
                }*/
              vm.forAllChectFunc();
            });
        };
        // 全选系统设置单击事件
        vm.chooseSystemAll = function (evt) {
            var choose = vm.allSystemChoosed = vm.hasSystemChoosed = evt.target.checked;
            vm.systemList.forEach(function (item) {
                item.checked = choose;
              //判断是否选择复选框
              /*  if(choose){
                  vm.checkRequest=true;
                }else{
                  vm.checkRequest=false;
                }*/
              vm.forAllChectFunc();
            });
        };

        // 全选货源会员认证设置单击事件
        vm.chooseSourceAll = function (evt) {
          var choose = vm.allSourceChoosed = vm.hasSourceChoosed = evt.target.checked;
          vm.sourceAuthList.forEach(function (item) {
            item.checked = choose;
            //判断是否选择复选框
          /*  if(choose){
              vm.checkRequest=true;
            }else{
              vm.checkRequest=false;
            }*/
            vm.forAllChectFunc();

          });
        };

        // 全选市场推广单击事件
        vm.chooseMarketAll = function (evt) {
          var choose = vm.allMarketChoosed = vm.hasMarketChoosed = evt.target.checked;
          vm.marketList.forEach(function (item) {
            item.checked = choose;
            //判断是否选择复选框
           /* if(choose){
              vm.checkRequest=true;
            }else{
              vm.checkRequest=false;
            }*/
            vm.forAllChectFunc();
          });
        };

        // 全选服务预约管理单击事件
        vm.chooseSubscribeAll = function (evt) {
          var choose = vm.allSubscribeChoosed = vm.hasSubscribeChoosed = evt.target.checked;
          vm.subscribeList.forEach(function (item) {
            item.checked = choose;
            //判断是否选择复选框
         /*   if(choose){
              vm.checkRequest=true;
            }else{
              vm.checkRequest=false;
            }*/
            vm.forAllChectFunc();
          });
        };

        /*全局判断是否有点击的复选框*/
        vm.forAllChectFunc=function () {
          vm.allCheckArray=vm.buessinesList.concat(vm.buessinesList,vm.systemList,vm.sourceAuthList,vm.marketList,vm.subscribeList);
          vm.checkRequest=false;
          for(var i=0;i<vm.allCheckArray.length;i++){
            if(vm.allCheckArray[i].checked){
              vm.checkRequest=true;
              break;
            }
          }

        };

        /**
         * 获取当前页面权限ids
         */
        function getFuncIds() {

            //权限ids
            var funcIds = '';

            //取得业务支撑
            vm.buessinesList.forEach(function (item) {

                if (document.getElementById(item.id).checked) {

                    funcIds += document.getElementById(item.id).value + ",";
                }
            });

            //取得系统设置
            vm.systemList.forEach(function (item) {
                if (document.getElementById(item.id).checked) {

                    funcIds += document.getElementById(item.id).value + ",";
                }
                
            });

            //取得货源会员认证
            vm.sourceAuthList.forEach(function (item) {
              if (document.getElementById(item.id).checked) {

                funcIds += document.getElementById(item.id).value + ",";
              }
              
            });

            //取得市场推广
            vm.marketList.forEach(function (item) {
              if (document.getElementById(item.id).checked) {

                funcIds += document.getElementById(item.id).value + ",";
              }
              
            });

            //取得服务预约管理
            vm.subscribeList.forEach(function (item) {
              if (document.getElementById(item.id).checked) {

                funcIds += document.getElementById(item.id).value + ",";
              }
              
            });
            return funcIds;
        }
        vm.userId=$rootScope.userInfo.userId;
        //提交
        vm.submit = function (evt, form) {
            evt.preventDefault();
            if (form.$valid && !vm.requesting) {
                vm.requesting = true;
                RuleService.addRole(vm.applyUserPhone, vm.backUp, getFuncIds(),vm.userId)
                    .then(function () {
                        $uibModalInstance.close();
                    })
                    .catch(function (err) {
                      $rootScope.catchError(err);
                    })
                    .then(function () {
                        vm.requesting = false;
                    });
            }
        };

    }
})();
