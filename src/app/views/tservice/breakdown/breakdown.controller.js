
(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceBreakdownController', TserviceBreakdownController);

    /** @ngInject */
    function TserviceBreakdownController($rootScope,$uibModal,GetTemplateUrl,$timeout,GetControllerName, Message,TbossService,DateUtil) {
        var vm = this;
        vm.moreshow=false;
        vm.moreobject=false;
        vm.breakdownDate=nowTime2();
        vm.moreobject=false;
        vm.moreobject2=false;
        vm.pageIndexOne =1;
        vm.pageSizeOne = 10;
        vm.pageIndexTwo =1;
        vm.pageSizeTwo = 10;
        vm.pageIndexThr =1;
        vm.pageSizeThr = 10;
        vm.Red=true;
        vm.flipOne = function (pageIndexOne) {
            vm.pageIndexOne = pageIndexOne;
            getList();
        };
        vm.flipTwo = function (pageIndexTwo) {
            vm.pageIndexTwo = pageIndexTwo;
            getList2();
        };
        vm.flipThr = function (pageIndexThr) {
            vm.pageIndexThr = pageIndexThr;
            getList3();
        };
        vm.formoreobj=function(){
            vm.moreobject=!vm.moreobject;
        };
        vm.formoreobj2=function(){
            vm.moreobject2=!vm.moreobject2;
        };
        function nowTime(){
            var nowDate=new Date(),format = 'yyyy-MM-dd';
            var nowtime=DateUtil.mactchStrToTime(nowDate, '0d', format);
            return nowtime
        }
        function nowTime2(){
            var nowDate2=new Date(),format = 'yyyy.MM.dd';
            var nowtime2=DateUtil.mactchStrToTime(nowDate2, '0d', format);
            return nowtime2
        }
        function selecTime(){
            var timeArray=vm.breakdownDate.split(".");
            var selecDate=new Date(timeArray[0],timeArray[1]-1,timeArray[2]," "," "," "),format = 'yyyy-MM-dd';
            var selecTime=DateUtil.mactchStrToTime(selecDate, '0d', format);
            return selecTime
        }
        vm.query={
            faultCode:'',
            faultTime:'',
            faultLevel:'',
            vin:''
        };
        vm.inputChange=function(){
            vm.query.faultCode=vm.inputKey;
            getList();
        };
        vm.changeDate=function(){
            // vm.query.faultTimeStart=vm.breakdownDateStart ? vm.breakdownDateStart.replace(/\./g, '.') : vm.breakdownDateStart,
            // vm.query.faultTimeEnd=vm.breakdownDateEnd ? vm.breakdownDateEnd.replace(/\./g, '.') : vm.breakdownDateEnd,
            getList()
        };
        vm.onVinFilter = function () {
            getList();
        }
        function getList() {
            // vm.query.faultTime=selecTime() ;
            TbossService.QueryFaultRecord(vm.pageIndexOne,vm.pageSizeOne,vm.query)
                .then(function (data) {
                    if(data!=undefined&&data!=''&&data!=null){
                        vm.Breakdowndata=data.list;
                        vm.totalOne=data.total;
                }else{
                        vm.Breakdowndata='';
                    }
        })
                .catch(function (err) {
                    $rootScope.catchError(err);
                });
        }
        getList();
//故障等级下拉
        vm.breakdownClassAll=[
            {key:'A',name:'A'},
            {key:'B',name:'B'}
        ];
        vm.breakdownFaultLevel=function(){
            getList();
        };
        vm.ruleSerachKey='';
        function getList2() {
            TbossService.QueryNoticeRuleList(vm.pageIndexTwo,vm.pageSizeTwo,vm.ruleSearchKey)
                .then(function (data) {
                        vm.BreakdownRules=data.list;
                        vm.totalTwo=data.total;
                })
                .catch(function (err) {
                    $rootScope.catchError(err);
                });
        }
        getList2();
        vm.ruleInput=function(){
            getList2();
        };
        vm.addRule=function(){
            $uibModal.open({
                templateUrl:GetTemplateUrl('tservice.breakdown.addrule'),
                controller: GetControllerName('tservice.breakdown.addrule'),
                controllerAs: 'vm',
                windowClass: 'tservice-breekdown-small-addrule',
                backdrop: false
            }).result.then(function () {//回传到父级页面
                    Message.success('添加成功');
                    getList2();
                });
        };
        //获取故障码列表
        function getList3() {
            TbossService.QueryFaultBase(vm.pageIndexThr,vm.pageSizeThr,vm.codefaultCode)
                .then(function (data) {
                    vm.FaultBase=data.list;
                    vm.totalThr=data.total;
                })
                .catch(function (err) {
                    $rootScope.catchError(err);
                });
        }
        getList3();
        vm.codeChange=function(){
            getList3();
        };
        vm.addCode=function(){
            $uibModal.open({
                templateUrl:GetTemplateUrl('tservice.breakdown.addcode'),
                controller: GetControllerName('tservice.breakdown.addcode'),
                controllerAs: 'vm',
                windowClass: 'tservice-breekdown-small-addcode',
                backdrop: false
            }).result.then(function () {//回传到父级页面
                    Message.success('添加成功');
                    getList3();
                });
        };
        vm.itemCode=function(code){
            $uibModal.open({
                templateUrl:GetTemplateUrl('tservice.breakdown.addcode'),
                controller: GetControllerName('tservice.breakdown.editcode'),
                controllerAs: 'vm',
                resolve:{        //传参
                    FaultCode:function(){return code}
                },
                windowClass: 'tservice-breekdown-small-editcode',
                backdrop: false
            }).result.then(function () {//回传到父级页面
                    Message.success('添加成功');
                    getList3();
                });
        };
        vm.removeRule=function(id,levelCode){
            Message.confirm('确定要删除等级编码 ' + levelCode + ' ？', '删除')
                .then(function () {
                    TbossService.DeleteNoticeRule(id)
                        .then(function () {
                            Message.success('删除成功');
                            getList2();
                        })
                        .catch(function (err) {
                            $rootScope.catchError(err);
                        })
                })
        };
        vm.removeCode=function(code){
            Message.confirm('确定要删除故障码 ' + code + ' ？', '删除')
                .then(function () {
                    TbossService.DelFaultBase(code,$rootScope.userInfo.userId)
                    .then(function () {
                        Message.success('删除成功');
                        getList3();
                    })
                    .catch(function (err) {
                        $rootScope.catchError(err);
                    })
                })
        };
        vm.edit=function(id,time){
            $uibModal.open({
                templateUrl:GetTemplateUrl('tservice.breakdown.details'),
                controller: GetControllerName('tservice.breakdown.details'),
                controllerAs: 'vm',
                resolve:{        //传参
                    faultid:function(){return id},
                    faulttime:function(){return time}
                },
                windowClass: 'tservice-breakdown-small-details',
                backdrop: false
            }).result.then(function () {//回传到父级页面
                    Message.success('添加成功');
                    getList2();
                });
        };
        vm.editRule=function(id){
            $uibModal.open({
                templateUrl:GetTemplateUrl('tservice.breakdown.addrule'),
                controller: GetControllerName('tservice.breakdown.editrule'),
                controllerAs: 'vm',
                resolve:{        //传参
                    routeid:function(){return id}
                },
                windowClass: 'tservice-breekdown-small-addcode',
                backdrop: false
            }).result.then(function () {//回传到父级页面
                    Message.success('添加成功');
                    getList2();
                });
        };
        vm.openImport = function () {
            var createStateName = 'tservice.breakdown.import';
            $uibModal.open({
                templateUrl: GetTemplateUrl(createStateName),
                controller: GetControllerName(createStateName),
                controllerAs: 'vm',
                windowClass: 'tservice-breakdown-small-modal'
            }).result.then(function () {
                    Message.success('导入成功, 2秒钟后刷新列表');
                    $timeout(function() {
                        getList3();
                    }, 2000);
                });
        };

    }
})();

