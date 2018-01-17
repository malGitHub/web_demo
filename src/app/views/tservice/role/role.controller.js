(function () {

    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceRoleController', TserviceRoleController);
    /** @ngInject */
    function TserviceRoleController($uibModal, GetTemplateUrl, GetControllerName, Message, RuleService, DateUtil,$rootScope) {

        //构造方法
        var vm = this;

        //分页相关
        vm.pageIndex = 1;
        vm.pageSize = 10;
        vm.total;
        vm.nowTime=new Date();

        //检索相关
        vm.inputText = '';//角色名称
        vm.roleDateStart = '';//创建开始时间
        vm.roleDateEnd = '';//创建结束时间
        vm.creator = '';//创建人
        vm.ruleData = null;//检索结果

        //初始化查询获取列表
        getRuleDdata();

        vm.flip = function (pageIndex) {
            vm.pageIndex = pageIndex;
            getRuleDdata();
        };

        //高级筛选
        vm.moreobject = false;
        vm.formoreobj = function () {
            vm.moreobject = !vm.moreobject;
            // if (vm.moreobject) {
            //     vm.roleDate = nowTime();
            // } else {
            //     vm.roleDate = "";
            // }
        };

        //调用新增页面
        vm.add = function () {
            $uibModal.open({
                templateUrl: GetTemplateUrl('tservice.role.roleadd'),//新增页面
                controller: GetControllerName('tservice.role.roleadd'),//新增controller
                controllerAs: 'vm',
                windowClass: 'overhidx',
                backdrop: false
            }).result.then(function () {
                    getRuleDdata();
                     Message.success('添加角色成功');
                });
        };

        //调用编辑页面
        vm.edit = function (obj) {
            $uibModal.open({
                templateUrl: GetTemplateUrl('tservice.role.roleedit'),//编辑页面
                controller: GetControllerName('tservice.role.roleedit'),//编辑controller
                controllerAs: 'vm',
                windowClass: 'overhidx',
                resolve: {        //传参
                    name: function () {
                        return obj.name//角色名称
                    },
                    description: function () {
                        return obj.description//描述
                    },
                    suportIds: function () {
                        return obj.suportIds//业务支撑权限
                    },
                    systemIds: function () {
                        return obj.systemIds//系统设置权限
                    },
                    sourceAuthIds: function () {
                        return obj.sourceAuthIds//货源会员认证权限
                    },
                    marketIds: function () {
                        return obj.marketIds//市场推广权限
                    },
                    subscribeIds: function () {
                        return obj.subscribeIds//服务预约管理权限
                    },
                    id: function () {
                        return obj.id//角色id
                    }
                },
                backdrop: false
            }).result.then(function () {
                    getRuleDdata();
                    Message.success('编辑角色成功');
                });
        };

        //获取下拉框列表
        vm.change = function () {
            RuleService.getCreator().then(function (data) {
                vm.CREATOR = data.list;
            })
                .catch(function (err) {
                  $rootScope.catchError(err);
                });
        };

        //根据条件查询获取列表
        function getRuleDdata() {
          if (vm.roleDateEnd != '' &&  vm.roleDateStart != '' && vm.roleDateEnd< vm.roleDateStart){
            Message.error('结束时间应该大于开始时间！');
            return;
          }
            RuleService.getRuleList(vm.inputText, selecTimeStart(),selecTimeEnd(), vm.creator, vm.pageIndex, vm.pageSize, vm.total)
                .then(function (data) {
                    vm.ruleData = data.list;
                    vm.total = data.total;//设置分页总数
                })
                .catch(function (err) {
                  $rootScope.catchError(err);
                });
        }

        /**
         * 条件检索 变换自动查询(时间，创建人等)
         */
        vm.changeDate = function () {
            getRuleDdata()
        };



        /**
         * 时间转换（yyyy.mm.dd-->yyyy-mm-dd）
         * @returns {*}
         */
        function selecTimeStart() {
            if (vm.roleDateStart != null && vm.roleDateStart != '' && vm.roleDateStart != undefined) {
                var timeArray=vm.roleDateStart.split(".");
                var selecDate = new Date(timeArray[0],timeArray[1]-1,timeArray[2]," "," "," "), format = 'yyyy-MM-dd';
                var selecTime = DateUtil.mactchStrToTime(selecDate, '0d', format);
                return selecTime;
            } else {
                return "";
            }
        }
      function selecTimeEnd() {
        if (vm.roleDateEnd != null && vm.roleDateEnd != '' && vm.roleDateEnd != undefined) {
          var timeArray=vm.roleDateEnd.split(".");
          var selecDate = new Date(timeArray[0],timeArray[1]-1,timeArray[2]," "," "," "), format = 'yyyy-MM-dd';
          var selecTime = DateUtil.mactchStrToTime(selecDate, '0d', format);
          return selecTime;
        } else {
          return "";
        }
      }

        //删除角色列表一条
        vm.del = function (id,name) {
            Message.confirm('确定要删除角色 ' + name + ' ？', '删除')
                .then(function () {
                    RuleService.deleteRole(id)
                        .then(function () {
                            Message.success('删除成功');
                            getRuleDdata();
                        })
                        .catch(function (err) {
                          $rootScope.catchError(err);
                        });
                });
        };

    }
})();

