(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceDptcontrolController', TserviceDptcontrolController);

  /** @ngInject */
  function TserviceDptcontrolController($rootScope,$uibModal,GetTemplateUrl,GetControllerName, Message, dtpService,DateUtil) {
    var vm = this;
    vm.moreobject=false;
    vm.pageIndex = 1;
    vm.pageSize =10;
    vm.orderBy =false;
    vm.updown="down";
    vm.nowTime=new Date();
    vm.query={
      createTimeStart:'',
      createTimeEnd:'',
      creatorId:'',
      keyword:'',
      sortType:'desc'
    };
    vm.formoreobj=function(){
      vm.moreobject=!vm.moreobject;
      // if (vm.moreobject) {
      //   vm.createDate = nowTime();
      // } else {
      //   vm.createDate = "";
      // }
    };
    vm.flip = function (pageIndex) {
      vm.pageIndex = pageIndex;
      getList();
    };
    //新建
    vm.add=function(){
      $uibModal.open({
        templateUrl:GetTemplateUrl('tservice.dptcontrol.dptcontroladd'),
        controller: GetControllerName('tservice.dptcontrol.dptcontroladd'),
        controllerAs: 'vm',
        windowClass: 'tservice-dptcontrol-small-dptcontroladd',
        backdrop: false
      }).result.then(function () {//回传到父级页面
          getList();
          Message.success('操作成功');
        });
    };
    //编辑
    vm.edit=function(id,name,pid,pName){
      $uibModal.open({
        templateUrl:GetTemplateUrl('tservice.dptcontrol.dptcontroledit'),
        controller: GetControllerName('tservice.dptcontrol.dptcontroledit'),
        controllerAs: 'vm',
        windowClass: 'tservice-dptcontrol-small-dptcontroledit',
        resolve:{        //传参
            id:function(){return id},
            name:function(){return name},
            pid:function(){return pid},
            pName:function(){return pName}
        },
        backdrop: true
      }).result.then(function () {//回传到父级页面
          getList();
          Message.success('操作成功');
        });
    };
    //列表初期化
    function getList() {
      dtpService.QueryList(vm.pageIndex,vm.pageSize,vm.query)
            .then(function (data) {
                vm.mydata=data.list;
                vm.total=data.total;
            })
            .catch(function (err) {
              $rootScope.catchError(err);
            });
    }
    getList();
    //高级筛选及检索
    vm.searchList=function (createTimeStart,createTimeEnd,creatorId,keyword,sortType,isSortType,isDateNull) {
      vm.updown=(vm.updown=='up'?'down':'up');
      if (isSortType){
        if(!vm.orderBy){
          vm.query.sortType = 'asc';
          vm.orderBy = true;
        }
        else{
          vm.query.sortType = 'desc';
          vm.orderBy = false;
        }
      }
      if (isDateNull){
        createTimeStart = '';
        createTimeEnd = '';
      }
      if (createTimeStart != ''){
        createTimeStart = selecTime(createTimeStart)
      }

      if (createTimeEnd != ''){
        createTimeEnd = selecTime(createTimeEnd)
      }

      if (createTimeEnd != '' && createTimeStart != '' && createTimeEnd<createTimeStart){
        Message.error('结束时间应该大于开始时间！');
        return;
      }

      sortType = vm.query.sortType;
      vm.query={
        createTimeStart:createTimeStart,
        createTimeEnd:createTimeEnd,
        creatorId:creatorId,
        keyword:keyword,
        sortType:sortType
      };
      dtpService.QueryList(vm.pageIndex,vm.pageSize,vm.query)
        .then(function (data) {
          vm.mydata=data.list;
          vm.total=data.total;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }
    //删除部门管理列表一条
    vm.remove = function (id,name) {
        Message.confirm('请确认删除 ' + name + ' 吗', '删除')
            .then(function () {
            dtpService.DeleteDptInfo(id)
                    .then(function () {
                        Message.success('删除成功');
                        getList();
                    })
                    .catch(function (err) {
                      $rootScope.catchError(err);
                    });
            });
    };
    //创建人下拉
    function getCreatorIdList(){
      dtpService.GetPerList()
        .then(function (data) {
          vm.CREATOR_ID=data.list;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }
    getCreatorIdList();
    //日期格式转换
    function selecTime(createTime) {
      if (createTime != null) {
        var timeArray=createTime.split(".");
        var selecDate = new Date(timeArray[0],timeArray[1]-1,timeArray[2]," "," "," "), format = 'yyyy-MM-dd';
        var selecTime = DateUtil.mactchStrToTime(selecDate, '0d', format);
        return selecTime;
      }
    }
    function nowTime() {
      var nowDate=new Date(),format = 'yyyy.MM.dd';
      var nowtime=DateUtil.mactchStrToTime(nowDate, '0d', format);
      return nowtime
    }
  }
})();

