/**
 * Created by zhaosp on 2016/11/7.
 */
(function () {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceMessageController', TserviceMessageController);

  /** @ngInject */
  function TserviceMessageController($uibModal,$rootScope, GetTemplateUrl, GetControllerName, Message, MessageService,myParams) {

    var vm = this;

    // -------------------------------------------推送消息-------------------------------------------
    vm.moreobject = false;
    vm.total = 0;
    vm.pageIndex = 1;
    vm.pageSize = 10;
    vm.sendMsgData = [];
    vm.msg_active=false;//默认没被点击
    if(myParams.get().active==1){
      vm.msg_active=true;
    }
    myParams.set({"active":0});
    vm.query = {
      timeRange: "0",
      noticeType: "",
      keyWord: ""
    };
    vm.TIME_RANGE = [
      {name: '0', shade: '全部'},
      {name: '1', shade: '最近一周'},
      {name: '2', shade: '最近一个月'},
      {name: '3', shade: '最近三个月'},
      {name: '4', shade: '最近六个月'},
      {name: '5', shade: '最近一年'}
    ];

    vm.TARGET_TYPE = [
      {name: '0', shade: '全部用户'},
      {name: '1', shade: '部分用户'},
      {name: '2', shade: '特定用户'}
    ];

    vm.NOTICE_TYPE = [
      {name: '', shade: '全部方式'},
      {name: '0', shade: 'APP'}
      //{name: '1', shade: '短信'}
    ];

    //消息大分类
    vm.MSG_TYPE_OPT = [
      {val: '1', name: '通知', ref: 'vm.MSG_NOTAICE_OPT'},
      {val: '2', name: '公告', ref: 'vm.MSG_PUBLIC_OPT'},
      {val: '3', name: '版本', ref: 'vm.MSG_VERSION_OPT'},
      {val: '4', name: '故障', ref: 'vm.MSG_TROUBLE_OPT'},
      {val: '5', name: '车辆动态', ref: 'vm.MSG_STATE_OPT'},
      {val: '6', name: '报警', ref: 'vm.MSG_ALERT_OPT'},
      {val: '7', name: '保养', ref: 'vm.MSG_KEEPUP_OPT'},
      {val: '8', name: '保险', ref: 'vm.MSG_SAFE_OPT'},
      {val: '9', name: '违章', ref: 'vm.MSG_FAULT_OPT'}
    ];






    /**
     * 数据转换  TARGET_TYPE  对应 中文转义
     * @param objs
     * @returns {*}
     */
    function convertTARGET_TYPE(objs) {
      angular.forEach(objs, function (data, index, arr) {
        angular.forEach(vm.TARGET_TYPE, function (data0, index0, arr0) {
          if (data.targetType == data0.name) {
            data.targetType = data0.shade;
            return false;
          }
        });
      });
      return objs;
    }


    /**
     * 查询发送消息方法
     */
    function getSendMsgList() {
      MessageService.SendMsgList(vm.pageIndex, vm.pageSize, vm.query).then(function (data) {
        vm.sendMsgData = convertTARGET_TYPE(data.list);
        vm.total = data.total;
      }).catch(function (err) {
        $rootScope.catchError(err);
      });
    }

    getSendMsgList();

    /**
     * 调用添加页面
     */
    vm.new = function () {
      $uibModal.open({
        templateUrl: GetTemplateUrl('tservice.message.messageadd'),
        controller: GetControllerName('tservice.message.messageadd'),
        controllerAs: 'vm',
        windowClass: 'tservice-message-small-messageadd',
        backdrop: false
      }).result.then(function () {
       });
    };

    /**
     * 调用重发页面
     */
    vm.resend = function (id) {
      $uibModal.open({
        templateUrl: GetTemplateUrl('tservice.message.messageadd'),
        controller: GetControllerName('tservice.message.messageresend'),
        controllerAs: 'vm',
        windowClass: 'tservice-message-small-messageadd',
        backdrop: false,
        resolve: {
          id: function () {
            return angular.copy(id);
          }
        }
      }).result.then(function () {
       });

    };


    /**
     * 高级查询与关键字查询方法
     */
    vm.advSearch = function () {
      vm.pageIndex = 1;
      getSendMsgList();
    };

    /**
     * 页码点击方法
     * @param pageIndex
     */
    vm.flip = function (pageIndex) {
      vm.pageIndex = pageIndex;
      getSendMsgList();
    };

    /**
     * 显示高级选项方法
     */
    vm.formoreobj = function () {
      vm.moreobject = !vm.moreobject;
    };

    // -------------------------------------------消息模板-------------------------------------------

    vm.total1 = 0;
    vm.pageIndex1 = 1;
    vm.pageSize1 = 10;
    vm.msgModelData = [];



    vm.query1 = {
      searchKey: ""
    }

    /**
     * 消息模板查询方法
     */
    function getMsgModelList() {
      MessageService.MsgModelList(vm.pageIndex1, vm.pageSize1, vm.query1).then(function (data) {
        vm.msgModelData = data.list;
        convertMSG_TYPE(vm.msgModelData);
        vm.total1 = data.total;
      }).catch(function (err) {
        $rootScope.catchError(err);
      });
    }

    /**
     * 数据转换  TARGET_TYPE  对应 中文转义
     * @param objs
     * @returns {*}
     */
    function convertMSG_TYPE(objs) {
      angular.forEach(objs, function (data, index, arr) {
        angular.forEach(vm.MSG_TYPE_OPT, function (data0, index0, arr0) {
          if (data.type == data0.val) {
            data.typeName = data0.name;
            return false;
          }
        });
      });
      return objs;
    }



    getMsgModelList();

    /**
     * 页脚查询方法
     * @param pageIndex
     */
    vm.flip1 = function (pageIndex) {
      vm.pageIndex1 = pageIndex;
      getMsgModelList();
    }


    /**
     * 右上角关键字查询方法
     */
    vm.searchModel = function(){
      vm.pageIndex1 = 1;
      getMsgModelList();
    }


    /**
     * 调用消息模板里的编辑页面
     */
    vm.editor = function (obj) {
      $uibModal.open({
        templateUrl: GetTemplateUrl('tservice.message.messageedit'),
        controller: GetControllerName('tservice.message.messageedit'),
        controllerAs: 'vm',
        windowClass: 'tservice-message-small-messageedit',
        backdrop: false,
        resolve:{
          modelUpdateObj:function(){return obj}
        }
      }).result.then(function () {
        getMsgModelList();
        Message.success('修改消息模板成功');
      });
    };

    /**
     * 删除模板方法
     * @param id
     */
    vm.removeModel = function (id) {
      Message.confirm('确定要删除用户该消息模板？', '删除')
          .then(function () {
            MessageService.deleteModel(id)
                .then(function () {
                  Message.success('删除成功');
                  getMsgModelList();
                })
                .catch(function (err) {
                  $rootScope.catchError(err);
                });
          });
    };
//-------------------------------------------短信息------------------------------------------------
    vm.total2 = 0;
    vm.pageIndex2 = 1;
    vm.pageSize2 = 10;
    vm.query2={
       title:"",
       timeRange:"0"
    };
    vm.TIME_CHANGE = [
      {name: '0', shade: '全部'},
      {name: '1', shade: '最近一周'},
      {name: '2', shade: '最近一个月'},
      {name: '3', shade: '最近三个月'},
      {name: '4', shade: '最近六个月'},
      {name: '5', shade: '最近一年'}
    ];
    //高级筛选
    vm.chitObject=false;
    vm.chooseChit=function () {
      vm.chitObject=!vm.chitObject;
    };
     vm.controlSort=false;
    vm.sortType="";
    vm.orderCheck = function () {
      vm.controlSort=!vm.controlSort;
      if(vm.controlSort){
        vm.sortType=0;
      }else {
        vm.sortType=1;
      }
      vm.getChitList();
      return vm.sortType;
    };

    //短信息列表
    vm.getChitList=function () {
      MessageService.SendChitList(vm.pageIndex2, vm.pageSize2, vm.query2,vm.sortType)
        .then(function (data) {
          vm.chitData = data.list;
          vm.total2=data.total;
       }).catch(function (err) {
        $rootScope.catchError(err);
      });
    };
    vm.getChitList();

    //分页
    vm.flip2 = function (pageIndex) {
      vm.pageIndex2 = pageIndex;
      vm.getChitList();
    }
  }
})();
