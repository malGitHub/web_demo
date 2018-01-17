/**
 * Created by zhaosp on 2016/10/31.
 */
(function () {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceMessageMessageeditController', TserviceMessageMessageeditController);
    function TserviceMessageMessageeditController($uibModalInstance, Message,MessageService,modelUpdateObj) {
        var vm = this;



        //页面对象
        vm.modelObj = {
            content: "",
            title: "",
            type: "",
            stype: "",
            code: "",
            words: "",
            receiveType: ""
        };

        //二级菜单默认绑定的数据源
        vm.nodeSelectOpts = {};

        vm.title = "编辑";

        /**
         * 下拉框接口未实现，先写死
         * @type {*[]}
         */
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
        //通知
        vm.MSG_NOTAICE_OPT = [
            {val: '1', name: '车主资质通过'},
            {val: '2', name: '车主资质不通过'},
            {val: '3', name: '原车主审核通过'},
            {val: '4', name: '原车主审核不通过'},
            {val: '5', name: '邀请司机'},
            {val: '6', name: '车主变更'},
            {val: '7', name: '司机接受邀请'},
            {val: '8', name: '管理员接收邀请'},
            {val: '9', name: '车主取消司机身份'},
            {val: '10', name: '车主分配线路'},
            {val: '11', name: '车主取消线路'},
            {val: '12', name: '客服回复'}
        ];
        //公告
        vm.MSG_PUBLIC_OPT = [{val: '1', name: '公告'}];
        //版本
        vm.MSG_VERSION_OPT = [{val: '1', name: '版本'}];
        //故障
        vm.MSG_TROUBLE_OPT = [{val: '1', name: '故障通知'}];
        //车辆动态
        vm.MSG_STATE_OPT = [
            {val: '1', name: '车况'},
            {val: '2', name: '关键点出入'}
        ];
        //报警
        vm.MSG_ALERT_OPT = [
            {val: '1', name: '油量液位报警'},
            {val: '2', name: '超速报警'}
        ];
        //保养
        vm.MSG_KEEPUP_OPT = [{val: '1', name: '基础保养'}];
        //保险
        vm.MSG_SAFE_OPT = [{val: '1', name: '保险到期'}];
        //违章
        vm.MSG_FAULT_OPT = [{val: '1', name: '违章信息'}];

        //接收者类型
        vm.MSG_REVICE_TYPE_OPT = [
            {val: '1', name: '司机端'},
            {val: '2', name: '车主端'}
        ];

        //初始化值
        vm.modelObj = modelUpdateObj;
        //数值初始化下拉框
        changeType();

        //消息分类change方法
        vm.changeType = changeType;

        /**
         * 下拉框修改值方法
         * 数值初始化下拉框方法
         */
        function changeType(){
            angular.forEach(vm.MSG_TYPE_OPT, function (data, index, arr) {
                //如果选中的为请选择，则清空二级菜单
                if(vm.modelObj.type==null){
                    vm.nodeSelectOpts = {};
                    return false;
                }
                if (vm.modelObj.type == data.val) {
                    //vm.nodeSelectOpts = $parse(data.ref)($scope);
                    vm.nodeSelectOpts = eval("("+data.ref+")");
                    return false;
                }
            });
        }

        /**
         * 修改方法
         * @param evt
         * @param form
         */
        vm.submit = function (evt, form) {
            evt.preventDefault();
            if (form.$valid && !vm.requesting) {
                vm.requesting = true;
                MessageService.updateModel(vm.modelObj)
                    .then(function () {
                        $uibModalInstance.close();
                    })
                    .catch(function (err) {
                        Message.error(err.message);
                    })
                    .then(function () {
                        vm.requesting = false;
                    });
            }
        };




        vm.closeEdit = function () {
            $uibModalInstance.dismiss();
        };
    }

})();

