(function () {

    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceActivitiesController', TserviceActivitiesController);
    /** @ngInject */
    function TserviceActivitiesController($rootScope, Message, ActivityListService) {
         //构造方法
        var vm = this;
         //分页相关
        vm.pageIndexOne = 1;
        vm.pageSizeOne = 10;
        vm.pageIndex = 1;
        vm.pageSize = 10;
        //活动状态
        vm.activit=[{key:'1',value:'进行中'},{key:'2',value:'已过期'},{key:'3',value:'未发布'},{key:'4',value:'未开始'},{key:'5',value:'已下架'},{key:'6',value:'已冻结'}];
        //审核结果
        vm.review=[{key:'1',value:'待提交'},{key:'2',value:'审核中'},{key:'3',value:'通过'},{key:'4',value:'未通过'},{key:'5',value:'冻结中'}];
        vm.coupon=[{key:'1',value:'有效'},{key:'2',value:'无效'}];
      //切换清空筛选条件
      vm.clearTab=function (index) {
        if (index == 0) {
          vm.query = {
            type: '1'
          };
          vm.getData();
        } else if (index == 1) {
          vm.query = {
            type: '2'
          };
          vm.getExamineData();
        }

      };
       vm.getData=function() {
         ActivityListService.ActivitiesList(vm.pageIndexOne,vm.pageSizeOne,vm.query)
              .then(function (data) {
                  vm.InfoList=data.list;
                  vm.totalOne = data.total;
              })
              .catch(function (err) {
                  $rootScope.catchError(err);
              });
        };
        vm.getData();

        vm.flipOne = function (pageIndex) {
             vm.pageIndexOne = pageIndex;
             vm.getData()
        };

        //高级筛选
        vm.moreobject = false;
        vm.formoreobj = function () {
            vm.moreobject = !vm.moreobject;
        };
      //下发活动列表一条
      vm.sendactive = function (name,id) {
        Message.confirm('请确认是否将该活动 ' + name + ' 下发到发放网点账户？', '下发')
          .then(function () {
            ActivityListService.sendactivities(id)
              .then(function () {
                Message.success('操作成功');
                vm.getData()
              })
              .catch(function (err) {
                $rootScope.catchError(err);
              });
          });
      };

      //下架活动列表一条
      vm.offlineactive = function (name,id) {
        Message.confirm('提示：活动下架后，所有发放网点将不能进行该活动的发放，兑换网点可以继续兑换已领取的优惠券。'
            +'<br>'+'请确认是否将该活动 ' + name + ' 下架？', '下架')
          .then(function () {
            ActivityListService.offlineactivities(id)
              .then(function () {
                Message.success('操作成功');
                vm.getData()
              })
              .catch(function (err) {
                $rootScope.catchError(err);
              });
          });
      };
      //冻结活动列表一条
      vm.freezeActivity = function (name,id) {
        Message.confirm('提示：活动冻结后，所有发放网点和兑换网点将不能进行该活动的发放和兑换。但重新激活该活动后，该活动在活动日期范围内将继续开展。'
            +'<br>'+'请确认是否将该活动 ' + name + ' 冻结？', '冻结')
          .then(function () {
            ActivityListService.stopactivities(id)
              .then(function () {
                Message.success('操作成功');
                vm.getData()
              })
              .catch(function (err) {
                $rootScope.catchError(err);
              });
          });
      };
      //删除活动列表一条
      vm.remove = function (name,id) {
        Message.confirm('确定要删除该活动 ' + name + ' ？', '删除')
          .then(function () {
            ActivityListService.activityDel(id)
              .then(function () {
                Message.success('删除成功');
                vm.getData();
              })
              .catch(function (err) {
                $rootScope.catchError(err);
              });
          });
      };
      vm.flip = function (pageIndex) {
        vm.pageIndex = pageIndex;
        vm.getExamineData()
      };
      vm.getExamineData=function() {
        ActivityListService.ActivitiesList(vm.pageIndex,vm.pageSize,vm.query)
          .then(function (data) {
            vm.examineList=data.list;
            vm.total = data.total;
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          });
      };
    }
})();

