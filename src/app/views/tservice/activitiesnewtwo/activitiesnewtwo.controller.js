/**
 * Created by Administrator on 2017/5/8.
 */
 (function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceActivitiesnewtwoController', TserviceActivitiesnewtwoController);
  function TserviceActivitiesnewtwoController($rootScope,$stateParams,$timeout,$uibModal,GetTemplateUrl,GetControllerName, ActivityService,TbossService,Message,$state,ActivityListService){
    var vm = this;
    vm.title="活动详情";
    vm.read = true;//为true不可编辑
    vm.pathRead = true;//已发布的活动、进行中的活动
    vm.overdue=true;//已发布的活动、进行中的活动
    vm.save="编辑";
    vm.id=$stateParams.id;  //活动id
    vm.actStatus=$stateParams.status; //活动状态
    vm.query={};
    vm.isAdd="";
    vm.isCar="";
    //发放网点（全部网点）
    vm.query1={
      keyWord:"",
      page_size:10,
      page_number:1,
      provinceId:"",
      cityId:"",
      stationId:"",
      stationType:"",
      flag:""
    };
    //发放网点（已添加网点）
    vm.query2={
      keyWord:"",
      page_size:10,
      page_number:1,
      provinceId:"",
      cityId:"",
      stationId:"",
      stationType:"",
      flag:""
    };
    //获取活动详情内容
    ActivityListService.activityDetail(vm.id)
      .then(function (data) {
        vm.list=data;
        vm.sendType=data.sendType;//下发
        vm.stopType=data.stopType;//冻结
        vm.activeStatus=data.reviewStatus;//审核状态
    /*    for(var i=0;i<data.sendList.length;i++){
          var store = {};
          store.pName = data.sendList[i].province;// == null?'全国':data.sendList[i].province;
          store.provinceId = data.sendList[i].provinceId;
          store.cName = data.sendList[i].city;
          store.cityId = data.sendList[i].cityId;
          store.sName = data.sendList[i].name;
          store.stationId = data.sendList[i].stationId;
          store.typeName = data.sendList[i].type;
          store.storeType = data.sendList[i].stationType;
          store.limit = data.sendList[i].quota == 0?'不限':data.sendList[i].quota+'';
          listAssembler(store,vm.selectedStores);
        }*/
       /* for(var i=0;i<data.exchangeList.length;i++){
          var store = {};
          store.pName = data.exchangeList[i].province == null?'全国':data.exchangeList[i].province;
          store.provinceId = data.exchangeList[i].provinceId;
          store.cName = data.exchangeList[i].city;
          store.cityId = data.exchangeList[i].cityId;
          store.sName = data.exchangeList[i].name;
          store.stationId = data.exchangeList[i].stationId;
          store.typeName = data.exchangeList[i].type;
          store.storeType = data.exchangeList[i].stationType;
          store.limit = data.exchangeList[i].quota == 0?'不限':data.exchangeList[i].quota+'';
          listAssembler(store,vm.selectedStores_ex);
        }*/
        vm.selectedSeries = data.carList; //车系
        vm.carChassisNumList=data.carChassisNumList;//底盘号
        //刷新页面时判断页面回到车系或者底盘号页面
        if(vm.selectedSeries.length==0&&vm.carChassisNumList.length!=0){
          vm.selSeries=false;
        }else {
          vm.selSeries=true;
          vm.isCar=1;
        }
        if(vm.carChassisNumList.length==0){
          vm.carSeries=false;
        }else {
          vm.carSeries=true;
        }
        //获取列表判断
        if(vm.list.activityEndDate=='' || vm.list.activityEndDate==undefined || vm.list.activityEndDate==null){
          vm.aciveTimeInput='0'
        }else{
          vm.aciveTimeInput='-1'
        }

        if(vm.list.singleQuota==1){
          vm.query.singleQuota='1'
        }else{
          vm.query.singleQuota='-1'
        }
      })
      .catch(function (err) {
        $rootScope.catchError(err);
      });
    /*vm.selectedStores=[];
    vm.selectedStores_ex=[];*/
    vm.carChassisNumList=[];

    vm.singleFunc=function () {
      switch(vm.query.singleQuota)
      {
        case '1':
          vm.list.singleQuota=1;
          break;
        default:
      }
    };
    /***********************************发放网点全部网点省份城市下拉列表*****************************************/
    //获取第一个下拉框（省份）
    getProvinceOne();
    function getProvinceOne(){
      ActivityService.getAreaList()
        .then(function (data) {
          vm.AreaList=data;
        })
        .catch(function (err) {
          $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
        });
    }
    //省份选择操作
    vm.changeProvinceOne=function(){
      if(vm.query1.provinceId != '' && vm.query1.provinceId != null) {
        //获取第二个下拉框（城市）
        ActivityService.getAreaList(vm.query1.provinceId)
          .then(function (data) {
            vm.CityList = data;
            vm.query1.stationType = '';
            vm.StoreList = [];
          })
          .catch(function (err) {
            $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
          });
      }else{
        vm.query1.stationType = '';
        vm.StoreList = [];
        vm.CityList = [];
      }
    };


    //城市下拉框选择操作
    vm.changeCityOne=function(){
      vm.query1.stationType='';
      vm.StoreList=[];
      if(vm.query1.provinceId != '' && vm.query1.provinceId != null) {
        getStoreList();
      }
    };

    vm.changeStoreTypeOne=function(){
      vm.StoreList=[];
      if(vm.query1.provinceId != '' && vm.query1.provinceId != null) {
        getStoreListOne();
      }
    };

    function getStoreListOne(){
      if(vm.query1.cityId!= '' && vm.query1.cityId != null) {
        //获取网点下拉框
        ActivityService.getStoreList(vm.query1.provinceId, vm.query1.cityId, vm.query1.stationType)
          .then(function (data) {
            vm.StoreList = data;
          })
          .catch(function (err) {
            $rootScope.messageError(err, '获取网点信息失败，请稍后重试');
          });
      }
    }

    vm.changeStoreOne = function(){
      if(vm.query1.stationId != null  && vm.query1.stationId != ''){
        for(var i=0;i<vm.StoreList.length;i++){
          if(vm.query1.stationId == vm.StoreList[i].stationId){
            vm.query1.stationType = vm.StoreList[i].storeType;
            break;
          }
        }
      }
    };


    /***************************************发放网点已添加网点的省市操作*********************************/
    //获取第一个下拉框（省份）
    getProvince();
    function getProvince(){
      ActivityService.getAreaList()
        .then(function (data) {
          vm.AreaList=data;
        })
        .catch(function (err) {
          $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
        });
    }
    //省份选择操作
    vm.changeProvince=function(){
      if(vm.query2.provinceId != '' && vm.query2.provinceId != null) {
        //获取第二个下拉框（城市）
        ActivityService.getAreaList(vm.query2.provinceId)
          .then(function (data) {
            vm.CityList = data;
            vm.query2.stationType = '';
            vm.StoreList = [];
          })
          .catch(function (err) {
            $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
          });
      }else{
        vm.query2.stationType = '';
        vm.StoreList = [];
        vm.CityList = [];
      }
    };


    //城市下拉框选择操作
    vm.changeCity=function(){
      vm.query2.stationType='';
      vm.StoreList=[];
      if(vm.query2.provinceId != '' && vm.query2.provinceId != null) {
        getStoreList();
      }
    };

    vm.changeStoreType=function(){
      vm.StoreList=[];
      if(vm.query2.provinceId != '' && vm.query2.provinceId != null) {
        getStoreList();
      }
    };

    function getStoreList(){
      if(vm.query2.cityId!= '' && vm.query2.cityId != null) {
        //获取网点下拉框
        ActivityService.getStoreList(vm.query2.provinceId, vm.query2.cityId, vm.query2.stationType)
          .then(function (data) {
            vm.StoreList = data;
          })
          .catch(function (err) {
            $rootScope.messageError(err, '获取网点信息失败，请稍后重试');
          });
      }
    }

    vm.changeStore = function(){
      if(vm.query2.stationId != null  && vm.query2.stationId != ''){
        for(var i=0;i<vm.StoreList.length;i++){
          if(vm.query2.stationId == vm.StoreList[i].stationId){
            vm.query2.stationType = vm.StoreList[i].storeType;
            break;
          }
        }
      }
    };

    //全部网点查询列表
    vm.noData=true;//无数据的显示判断
    vm.addBtn=true;//添加按钮点击查询后可点
    vm.getAllList=function () {
      ActivityService.queryTotalStation(vm.query1)
        .then(function (data) {
          if(data.list.length==0){
            vm.noData=true;
            vm.addBtn=true;
          }else {
            vm.noData=false;
            vm.addBtn=false;
          }
          vm.allStationList=data.list;
          vm.total1=data.total;
        }).catch(function (err) {
        $rootScope.catchError(err);
      });
    };
    //已添加网点查询列表
    vm.clearStore=true;//清除网点不可编辑
    vm.noAddedData=true;//无数据的显示判断
    vm.getAddedList=function () {
      ActivityService.alreadyAddedGrantStation(vm.id,vm.query2)
        .then(function (data) {
          //vm.noAddedData=false;
          vm.addedStationList=data.list;
          vm.total2=data.total;
        }).catch(function (err) {
        $rootScope.catchError(err);
      });
    };
    //Tab页切换清除下拉列表数据
    vm.clearTab1=function () {
      vm.query1={
        keyWord:"",
        page_size:10,
        page_number:1,
        provinceId:"",
        cityId:"",
        stationId:"",
        stationType:"",
        flag:""
      };
    };
    vm.clearTab2=function () {
      vm.query2={
        keyWord:"",
        page_size:10,
        page_number:1,
        provinceId:"",
        cityId:"",
        stationId:"",
        stationType:"",
        flag:""
      };
    };
    //逐条删除已添加网点
    vm.storeDelete = function(index){
      ActivityService.delActivityGrant(vm.id,vm.addedStationList[index].stationId,vm.addedStationList[index].provinceId,vm.addedStationList[index].cityId,vm.addedStationList[index].stationType)
        .then(function () {
          vm.query2.page_number=1;
          vm.getAddedList();
        })
        .catch(function (err) {
          $rootScope.messageError (err, '发放网点删除失败，请稍后重试');
        });
    };
    //清除网点
    vm.clearStation = function () {
      Message.confirm('是否要清除以下全部网点？', '删除')
        .then(function () {
          ActivityService.delActivityGrant(vm.id,vm.query2.stationId,vm.query2.provinceId,vm.query2.cityId,vm.query2.stationType)
            .then(function () {
              vm.query2.page_number=1;
              vm.getAddedList();
              vm.clearStore=true;//清除网点不可编辑
            })
            .catch(function (err) {
              $rootScope.messageError (err, '发放网点删除失败，请稍后重试');
            });
        }).catch(function () {

      });

    };

    //已下发的活动逐条删除已添加网点
    vm.storeDelete_send = function(index){
      ActivityService.sendUpdateActivityGrant(vm.id,vm.query2.keyWord,vm.addedStationList[index].provinceId,vm.addedStationList[index].cityId,vm.addedStationList[index].stationId,vm.addedStationList[index].stationType,vm.query2.flag)
        .then(function () {
          vm.query2.page_number=1;
          vm.getAddedList();
        })
        .catch(function (err) {
          $rootScope.messageError (err, '发放网点删除失败，请稍后重试');
        });
    };
    //已下发的活动清除网点
    vm.clearStation_send = function () {
      Message.confirm('是否要清除以下全部网点？', '删除')
        .then(function () {
          ActivityService.sendUpdateActivityGrant(vm.id,vm.query2.keyWord,vm.query2.provinceId,vm.query2.cityId,vm.query2.stationId,vm.query2.stationType,vm.query2.flag)
            .then(function () {
              vm.query2.page_number=1;
              vm.getAddedList();
              vm.clearStore=true;//清除网点不可编辑
            })
            .catch(function (err) {
              $rootScope.messageError (err, '发放网点删除失败，请稍后重试');
            });
        }).catch(function () {

      });

    };

    //分页
    vm.flip1= function (page_number) {
      vm.query1.page_number = page_number;
      vm.getAllList();

    };
    vm.flip2= function (page_number) {
      vm.query2.page_number = page_number;
      vm.getAddedList();
    };
     /***********************************选择网店start*****************************************/
    vm.AreaList=[];//省份列表
    vm.CityList=[];//城市列表
    vm.StoreList=[];//网点列表

    vm.limit=0;
    vm.limitif='false';
    vm.changeLimit = function(){
      if(vm.limitif=='true'){
        vm.limit=1;
      }else{
        vm.limit=0;
      }
    };
    //发放网点添加
    vm.addshop=function () {
       vm.read = true;
      ActivityService.addActivityGrant(vm.id,vm.query1.stationId,vm.query1.keyWord,vm.query1.provinceId,vm.limit,vm.query1.cityId,vm.query1.stationType)
        .then(function () {
          vm.read = false;
          vm.noAddedData=false;
          vm.getAddedList();
          vm.allStationList=[];
          vm.addBtn=true;
          vm.noData=true;
         })
        .catch(function (err) {
          vm.read = false;
          $rootScope.catchError(err);
        });
    };
    /***********************************选择网店end*****************************************/
    /***********************************选择车start*****************************************/
    //select下拉框默认选择为‘不限’
    vm.offStartDate='false';
    vm.offEndDate='false';
    vm.sellStartDate='false';
    vm.sellEndDate='false';
    vm.stdStartTime='false';
    vm.stdEndTime='false';
    //车辆下限日期
    vm.changeOffStartDate = function(){
      if(vm.offStartDate=='false'){
        vm.carOfflineStartDateClick="";
      }
    };
    vm.changeOffEndDate = function(){
      if(vm.offEndDate=='false'){
        vm.carOfflineEndDateClick="";
      }
    };
    //车辆销售日期
    vm.changeSellStartDate = function(){
      if(vm.sellStartDate=='false'){
        vm.carSellingStartDateClick="";
      }
    };
    //车辆销售日期
    vm.changeSellEndDate = function(){
      if(vm.sellEndDate=='false'){
        vm.carSellingEndDateClick="";
      }
    };

    //STD日期
    vm.CHANGE_STDStartDate = function(){
      if(vm.stdStartTime=='false'){
        vm.stdStartDateClick="";
      }
    };
    //STD日期
    vm.CHANGE_STDEndDate = function(){
      if(vm.stdEndTime=='false'){
        vm.stdEndDateClick="";
      }
    };

    vm.seriesDelete = function(index,seriesId,modelId){
      ActivityService.delSeries(vm.id,seriesId,modelId)
        .then(function () {
          vm.selectedSeries.splice(index,1);
        })
        .catch(function (err) {
          $rootScope.messageError (err, '活动车型删除失败，请稍后重试');
        });
    };

    //获取品牌
    TbossService.getBrandList()
      .then(function (data) {
        getCAR_SERVICE(data[0].brandId);
      })
      .catch(function (err) {
        $rootScope.messageError (err, '获取车辆品牌信息失败，请稍后重试');
      });

    //获取车系
    function getCAR_SERVICE(brandId){
      TbossService.getSeriseList(brandId)
        .then(function (data) {
          vm.CAR_SERIES=data;
        })
        .catch(function (err) {
          $rootScope.messageError (err, '车型信息获取失败，请稍后重试');
        });
    }

    //车系下拉框选择操作
    vm.changeSeries=function(){
      vm.model='';
      vm.CAR_Model=[];
      if(vm.series=='' || vm.series==null){
        return;
      }
      TbossService.getModelList_activity(vm.series)
        .then(function (data) {
          vm.CAR_Model=data;
        })
        .catch(function (err) {
          $rootScope.messageError (err, '车型信息获取失败，请稍后重试');
        });
    };

    //添加车型车系
    vm.addshop2=function () {
      var sName = $("#series").find("option:selected").text();
      var mName = $("#model").find("option:selected").text();
      if(sName == '全选' && mName == '全选'){
        sName = '所有车型';
        mName = '';
      }else if(sName != '全选' && mName == '全选'){
        sName = sName+'所有车型';
        mName = '';
      }
      ActivityService.addSeries(vm.id,vm.series,sName,vm.model,mName,vm.carOfflineStartDateClick,vm.carOfflineEndDateClick,vm.carSellingStartDateClick,vm.carSellingEndDateClick,vm.stdStartDateClick, vm.stdEndDateClick)
        .then(function () {
          vm.selectedSeries.push({series:vm.series,seriesName:sName,model:vm.model,modelName:mName,carOfflineStartDate:vm.carOfflineStartDateClick,carOfflineEndDate:vm.carOfflineEndDateClick,carSellingStartDate:vm.carSellingStartDateClick,carSellingEndDate:vm.carSellingEndDateClick
            ,stdStartDate:vm.stdStartDateClick,stdEndDate:vm.stdEndDateClick});

        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    };
    /***********************************选择车end*****************************************/

    /*本地时间*/
    vm.nowTime=new Date();
    /*校验字符和和汉字*/
    vm.getBLen = function(str) {
      if (str == null) return 0;
      if (typeof str != "string"){
        str += "";
      }
      return str.replace(/[^\x00-\xff]/g,"01").length;
    }

    /*function listAssembler(obj,list){
      if(obj.provinceId == obj.cityId) {
        //直辖市过滤
        obj.cName = "";
      }
      if(obj.stationId == null) {
        if (obj.provinceId == null && (obj.storeType == null || obj.storeType == '')) {
          obj.pName = "全国所有网点";
          obj.cName = "";
          obj.sName = "";
          obj.typeName = "";
        }
        else if (obj.provinceId == null && obj.storeType == '1') {
          obj.pName = "全国所有经销商";
          obj.cName = "";
          obj.sName = "";
          obj.typeName = "";
        }
        else if (obj.provinceId == null && obj.storeType == '2') {
          obj.pName = "全国所有服务站";
          obj.cName = "";
          obj.sName = "";
          obj.typeName = "";
        }
        else if (obj.provinceId != null && obj.cityId == null && (obj.storeType == null || obj.storeType == '')) {
          obj.pName = obj.pName + '所有网点';
          obj.cName = "";
          obj.sName = "";
          obj.typeName = "";
        }
        else if (obj.provinceId != null && obj.cityId == null && obj.storeType == '1') {
          obj.pName = obj.pName + '所有经销商';
          obj.cName = "";
          obj.sName = "";
          obj.typeName = "";
        }
        else if (obj.provinceId != null && obj.cityId == null && obj.storeType == '2') {
          obj.pName = obj.pName + '所有服务站';
          obj.cName = "";
          obj.sName = "";
          obj.typeName = "";
        }
        else if (obj.provinceId != null && obj.cityId != null && (obj.storeType == null || obj.storeType == '')) {
          obj.pName = obj.pName + obj.cName + '所有网点';
          obj.cName = "";
          obj.sName = "";
          obj.typeName = "";
        }
        else if (obj.provinceId != null && obj.cityId != null && obj.storeType == '1') {
          obj.pName = obj.pName + obj.cName + '所有经销商';
          obj.cName = "";
          obj.sName = "";
          obj.typeName = "";
        }
        else if (obj.provinceId != null && obj.cityId != null && obj.storeType == '2') {
          obj.pName = obj.pName + obj.cName + '所有服务站';
          obj.cName = "";
          obj.sName = "";
          obj.typeName = "";
        }
      }
      list.push(obj);
    }*/
    /***********************************************导入底盘号********************************************************/
    vm.chassisRead = true;
    //添加电话号码
    vm.numberAdd=function () {
      ActivityListService.addCarChassisNum(vm.id,vm.chassisNum)
        .then(function () {
          vm.chassisRead = false;
          vm.chassisNum=vm.chassisNum.toLocaleUpperCase();
          vm.carChassisNumList.push({chassisNum:vm.chassisNum});
          vm.chassisNum='';
        }).catch(function (err) {
        $rootScope.catchError(err);
        vm.chassisNum='';
      });

    };

    //删除
    vm.numberDelete = function(index,chassisNum){
      ActivityListService.delCarChassisNum(vm.id,chassisNum)
        .then(function () {
          vm.carChassisNumList.splice(index,1);
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });

    };
    //导入
    vm.openImport = function () {
      var createStateName = 'tservice.activitiesnewtwo.import';
      $uibModal.open({
        templateUrl: GetTemplateUrl(createStateName),
        controller: GetControllerName(createStateName),
        controllerAs: 'vm',
        windowClass: 'tservice-activitiesnewtwo-small-import',
        backdrop:false,
        resolve: {
          id: function () {return vm.id;},
          carChassisNumList: function () {return vm.carChassisNumList;}
        }
      }).result.then(function (result) {
        if(result.carChassisNumErrList.length!=0){
          vm.item(result);
        }else {
          Message.success('导入成功');
          vm.carChassisNumList=result.carChassisNumList;
        }
      });
    };
    //非法底盘号
    vm.item=function(msg){
      $uibModal.open({
        templateUrl:GetTemplateUrl('tservice.activitiesnewtwo.phone'),
        controller: GetControllerName('tservice.activitiesnewtwo.phone'),
        controllerAs: 'vm',
        windowClass: 'tservice-activitiesnewtwo-small-phone',
        backdrop:false,
        resolve: {
          carChassisNumErrList: function () {return msg.carChassisNumErrList;},
          carChassisNumList: function () {return msg.carChassisNumList;}
        }
      }).result.then(function (result) {
        Message.success('导入成功');
        $timeout(function() {
          vm.carChassisNumList=result;
        },2000);
      });

    };


    /********************************************编辑***************************************/
    vm.saveBtn=false;//保存按钮不显示
    if(vm.actStatus==2||vm.actStatus==5){
      vm.editBan=true;
    }else {
      vm.editBan=false;
    }
    vm.editConfirm=function () {
      vm.saveBtn=true;
      //活动状态为已下发，需要弹窗确认
      //活动状态为冻结中，发放数量、发放网点和兑换网点可编辑（vm.pathRead=false）
      //活动状态为已下架或者已过期，发放数量和兑换网点可编辑（vm.overdue=false）
      if(vm.sendType==1){
        Message.confirm('该活动已经下发，请先进行活动冻结，才能再次编辑')
          .then(function () {
            $state.go('tservice.activities');
          });
      }else if(vm.actStatus==6){
        vm.read=true;
        vm.pathRead=false;
        vm.overdue=false;
      }else if(vm.actStatus==2||vm.actStatus==5){
        vm.read=true;
        vm.pathRead=true;
        vm.overdue=false;
      }else {
        vm.read=false;
        vm.pathRead=false;
        vm.overdue=false;
      }

     };
     //保存并下一步
    vm.submit = function (evt, form) {
      evt.preventDefault();
      if (form.$valid && !vm.requesting) {
        if(vm.addedStationList.length == 0 ){
          vm.isAdd=1;
        }else if(vm.carChassisNumList.length == 0&&vm.selectedSeries.length == 0){
           vm.isCar=1;
        }else{
          vm.requesting = true;
          vm.isAdd=0;
          vm.isCar=0;
        }
        $state.go('tservice.activitiesdetail',{id: vm.id, status: vm.actStatus,isAdd:vm.isAdd,isCar:vm.isCar});
       }

    };
    vm.cancelBtn=$stateParams.cancel;
    //关闭新建消息页面
    vm.closeAdd = function (){
      $state.go('tservice.activitiesnewone',{id: vm.id, status: vm.actStatus,cancel:vm.cancelBtn});

    };
  }

})();
