(function () {

  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceUserController', TserviceUserController);
  /** @ngInject */
  function TserviceUserController($rootScope,$uibModal, GetTemplateUrl, GetControllerName, Message,DateUtil, UserService) {
    var vm = this;
    vm.pageIndex = 1;
    vm.pageSize =10;
    vm.total =500;
    vm.datePickTimeStart="";
    vm.datePickTimeEnd="";
    vm.inputText = "";
    vm.creator="";
    vm.sort=1;//降序
    vm.direction="down";
    vm.sortType="desc";
    vm.nowTime=new Date();
    vm.moreobject = false;
    vm.formoreobj=function(){
      vm.moreobject=!vm.moreobject;
    };
    vm.flip = function (pageIndex) {
      vm.pageIndex = pageIndex;
      vm.search();
    };
    getList();
    //新增
    vm.add = function () {
      $uibModal.open({
        templateUrl: GetTemplateUrl('tservice.user.useradd'),
        controller: GetControllerName('tservice.user.useradd'),
        controllerAs: 'vm',
        windowClass: 'tservice-user-small-useradd.modal-dialog',
        backdrop: true
      }).result.then(function () {
          vm.search();
           Message.success('添加用户成功');
        });
    };

    vm.edit = function (obj) {
       $uibModal.open({
        templateUrl: GetTemplateUrl('tservice.user.useredit'),
        controller: GetControllerName('tservice.user.useredit'),
        controllerAs: 'vm',
        windowClass: 'tservice-user-small-useredit.modal-dialog',
        resolve:{        //传参
          id:function(){return obj.id},
          name:function(){return obj.name},
          originalPwd:function(){return obj.password},
          departId:function(){return obj.departId},
          isLeader:function(){return obj.isLeader},
          departName:function(){return obj.departName},
          telephone:function(){return obj.telephone},
          description:function(){return obj.description},
          roleIds:function(){return obj.roleIds===undefined ? "": obj.roleIds}
        },
        backdrop: false
      }).result.then(function () {
        vm.search();
         Message.success('编辑用户成功');
      });
    };

    vm.search = function () {
      if (vm.datePickTimeEnd != '' &&  vm.datePickTimeStart != '' && vm.datePickTimeEnd< vm.datePickTimeStart){
        Message.error('结束时间应该大于开始时间！');
        return;
      }
      UserService.getUserList(vm.pageIndex,vm.pageSize,vm.creator,vm.datePickTimeStart,vm.datePickTimeEnd,vm.inputText,vm.sortType)
        .then(function (data) {
          vm.mydata=data.list;
          vm.total=data.total;
      })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    };
    vm.change = function () {
      UserService.getCreator().then(function (data) {
         vm.CREATOR=data.list;
      })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    };

    //删除用户列表一条
    vm.del = function (id,name) {
      Message.confirm('确定要删除用户 ' + name + ' ？', '删除')
        .then(function () {
          UserService.deleteUser(id)
            .then(function () {
              Message.success('删除成功');
              vm.search();
            })
            .catch(function (err) {
              $rootScope.catchError(err);
            });
        });
    };
    function nowTime(){
      var nowDate=new Date(),format = 'yyyy.MM.dd';
      var nowtime=DateUtil.mactchStrToTime(nowDate, '0d', format);
      return nowtime
    }
    function getList () {
      UserService.getUserList(vm.pageIndex,vm.pageSize,vm.creator,vm.datePickTimeStart,vm.datePickTimeEnd,vm.inputText,vm.sortType)
        .then(function (data) {
          vm.mydata=data.list;
          vm.total=data.total;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }
    vm.onSort = function () {
      vm.sort === 1 ? vm.sort = 2 : vm.sort = 1;
      vm.direction === 'down' ? vm.direction = 'up' : vm.direction = 'down';
      vm.sortType === 'desc' ? vm.sortType = 'asc' : vm.sortType = 'desc';
      vm.pageIndex=1;
      getList();
    };

  }
})();

