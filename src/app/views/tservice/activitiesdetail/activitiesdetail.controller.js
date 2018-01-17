/**
 * Created by Administrator on 2017/5/8.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceActivitiesdetailController', TserviceActivitiesdetailController);
  function TserviceActivitiesdetailController($rootScope,$stateParams,ActivityService,Message,$state,ActivityListService){
    var vm = this;
    vm.title="活动详情";
    vm.read = true;//为true不可编辑
    vm.pathRead = true;//已发布的活动、进行中的活动
    vm.overdue=true;//已发布的活动、进行中的活动
    vm.save="编辑";
    vm.id=$stateParams.id;  //活动id
    vm.actStatus=$stateParams.status; //活动状态
    vm.addDate=$stateParams.isAdd; //下发网点是否已添加（0为已添加）
    vm.carDate=$stateParams.isCar; //所选车型是否已添加（0为已添加）
    vm.views=false;//审核结论
    vm.active={};

    //获取活动详情内容
    ActivityListService.activityDetail(vm.id)
      .then(function (data) {
        vm.list=data;
        vm.sendType=data.sendType;//下发
        vm.stopType=data.stopType;//冻结
        vm.activeStatus=data.reviewStatus;//审核状态

        /*for(var i=0;i<data.exchangeList.length;i++){
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
        //审核状态
         if(vm.list.reviewStatus=='3'||vm.list.reviewStatus=='4'){
          vm.views=true;
        }else{
          vm.views=false;
        }
        //单车发放限额
        if(vm.list.singleQuota==1){
          vm.active.singleQuota='1'
        }else{
          vm.active.singleQuota='-1'
        }

       })
      .catch(function (err) {
        $rootScope.catchError(err);
      });
     vm.selectedStores_ex=[];
     vm.datavies=[                         //审核结果
      {viewId:1,viewName:"待提交"},
      {viewId:2,viewName:"审核中"},
      {viewId:3,viewName:"通过"},
      {viewId:4,viewName:"未通过"}
    ];
      /***********************************选择兑换网点start*****************************************/
    //兑换网点（全部网点）
    vm.query3={
      keyWord:"",
      page_size:10,
      page_number:1,
      provinceId:"",
      cityId:"",
      stationId:"",
      stationType:"",
      flag:""
    };
    //兑换网点（已添加网点）
    vm.query4={
      keyWord:"",
      page_size:10,
      page_number:1,
      provinceId:"",
      cityId:"",
      stationId:"",
      stationType:"",
      flag:""
    };
    //Tab页切换清除下拉列表数据
    vm.clearTab3=function () {
      vm.query3={
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
    vm.clearTab4=function () {
      vm.query4={
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
    /***********************************省份城市下拉列表*****************************************/
    //获取第一个下拉框（省份）
    getProvinceOne_ex();
    function getProvinceOne_ex(){
      ActivityService.getAreaList()
        .then(function (data) {
          vm.AreaList_ex=data;
        })
        .catch(function (err) {
          $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
        });
    }
    //省份选择操作
    vm.changeProvinceOne_ex=function(){
      if(vm.query3.provinceId != '' && vm.query3.provinceId != null) {
        //获取第二个下拉框（城市）
        ActivityService.getAreaList(vm.query3.provinceId)
          .then(function (data) {
            vm.CityList_ex = data;
            vm.query3.stationType = '';
            vm.StoreList_ex = [];
          })
          .catch(function (err) {
            $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
          });
      }else{
        vm.query3.stationType = '';
        vm.StoreList_ex = [];
        vm.CityList_ex = [];
      }
    };


    //城市下拉框选择操作
    vm.changeCityOne_ex=function(){
      vm.query3.stationType='';
      vm.StoreList_ex=[];
      if(vm.query3.provinceId != '' && vm.query3.provinceId != null) {
        getStoreListOne_ex();
      }
    };

    vm.changeStoreTypeOne_ex=function(){
      vm.StoreList_ex=[];
      if(vm.query3.provinceId != '' && vm.query3.provinceId != null) {
        getStoreListOne_ex();
      }
    };

    function getStoreListOne_ex(){
      if(vm.query3.cityId!= '' && vm.query3.cityId != null) {
        //获取网点下拉框
        ActivityService.getStoreList(vm.query3.provinceId, vm.query3.cityId, vm.query3.stationType)
          .then(function (data) {
            vm.StoreList_ex = data;
          })
          .catch(function (err) {
            $rootScope.messageError(err, '获取网点信息失败，请稍后重试');
          });
      }
    }

    vm.changeStoreOne_ex = function(){
      if(vm.query3.stationId != null  && vm.query3.stationId != ''){
        for(var i=0;i<vm.StoreList_ex.length;i++){
          if(vm.query3.stationId == vm.StoreList_ex[i].stationId){
            vm.query3.stationType = vm.StoreList_ex[i].storeType;
            break;
          }
        }
      }
    };

    /***************************************已添加网点的省市操作*********************************/
    //获取第一个下拉框（省份）
    getProvince_ex();
    function getProvince_ex(){
      ActivityService.getAreaList()
        .then(function (data) {
          vm.AreaList_ex=data;
        })
        .catch(function (err) {
          $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
        });
    }
    //省份选择操作
    vm.changeProvince_ex=function(){
      if(vm.query4.provinceId != '' && vm.query4.provinceId != null) {
        //获取第二个下拉框（城市）
        ActivityService.getAreaList(vm.query4.provinceId)
          .then(function (data) {
            vm.CityList_ex = data;
            vm.query4.stationType = '';
            vm.StoreList_ex = [];
          })
          .catch(function (err) {
            $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
          });
      }else{
        vm.query4.stationType = '';
        vm.StoreList_ex = [];
        vm.CityList_ex = [];
      }
    };


    //城市下拉框选择操作
    vm.changeCity_ex=function(){
      vm.query4.stationType='';
      vm.StoreList_ex=[];
      if(vm.query4.provinceId != '' && vm.query4.provinceId != null) {
        getStoreList_ex();
      }
    };

    vm.changeStoreType_ex=function(){
      vm.StoreList_ex=[];
      if(vm.query4.provinceId != '' && vm.query4.provinceId != null) {
        getStoreList_ex();
      }
    };

    function getStoreList_ex(){
      if(vm.query4.cityId!= '' && vm.query4.cityId != null) {
        //获取网点下拉框
        ActivityService.getStoreList(vm.query4.provinceId, vm.query4.cityId, vm.query4.stationType)
          .then(function (data) {
            vm.StoreList_ex = data;
          })
          .catch(function (err) {
            $rootScope.messageError(err, '获取网点信息失败，请稍后重试');
          });
      }
    }

    vm.changeStore_ex = function(){
      if(vm.query4.stationId != null  && vm.query4.stationId != ''){
        for(var i=0;i<vm.StoreList_ex.length;i++){
          if(vm.query4.stationId == vm.StoreList_ex[i].stationId){
            vm.query4.stationType = vm.StoreList_ex[i].storeType;
            break;
          }
        }
      }
    };

    //全部网点查询列表
    vm.noData_ex=true;//无数据的显示判断
    vm.addBtn_ex=true;//添加在查询后可点击
    vm.getAllList_ex=function () {
      ActivityService.queryTotalExchangeStation(vm.query3)
        .then(function (data) {
          if(data.list.length==0){
            vm.noData_ex=true;
            vm.addBtn_ex=true;
          }else {
            vm.noData_ex=false;
            vm.addBtn_ex=false;
          }

          //vm.noData_ex=false;
          vm.allStationList_ex=data.list;
          vm.total3=data.total;
        }).catch(function (err) {
        $rootScope.catchError(err);
      });
    };
    //已添加网点查询列表
    vm.clearStore_ex=true;//清除网点不可编辑
    vm.noAddedData_ex=true;//已添加的无数据
    vm.getAddedList_ex=function () {
      ActivityService.alreadyAddedExchangeStation(vm.id,vm.query4)
        .then(function (data) {
          //vm.noAddedData=false;
          vm.addedStationList_ex=data.list;
          vm.total4=data.total;
        }).catch(function (err) {
        $rootScope.catchError(err);
      });
    };

    //逐条删除已添加网点
    vm.storeDelete_ex = function(index){
      ActivityService.delActivityExchange(vm.id,vm.addedStationList_ex[index].stationId,vm.addedStationList_ex[index].provinceId,vm.addedStationList_ex[index].cityId,vm.addedStationList_ex[index].stationType)
        .then(function () {
          vm.query4.page_number=1;
          vm.getAddedList_ex();
        })
        .catch(function (err) {
          $rootScope.messageError (err, '兑换网点删除失败，请稍后重试');
        });
    };
    //清除网点
    vm.clearStation_ex = function () {
      Message.confirm('是否要清除以下全部网点？', '删除')
        .then(function () {
          ActivityService.delActivityExchange(vm.id,vm.query4.stationId,vm.query4.provinceId,vm.query4.cityId,vm.query4.stationType)
            .then(function () {
              vm.query4.page_number=1;
              vm.getAddedList_ex();
              vm.clearStore_ex=true;//清除网点不可编辑
            })
            .catch(function (err) {
              $rootScope.messageError (err, '兑换网点删除失败，请稍后重试');
            });
        }).catch(function () {

      });

    };

    //已下发的活动逐条删除已添加网点
    vm.storeDelete_exchange = function(index){
      ActivityService.sendUpdateActivityExchange(vm.id,vm.query4.keyWord,vm.addedStationList_ex[index].provinceId,vm.addedStationList_ex[index].cityId,vm.addedStationList_ex[index].stationId,vm.addedStationList_ex[index].stationType,vm.query4.flag)
        .then(function () {
          vm.query4.page_number=1;
          vm.getAddedList_ex();
        })
        .catch(function (err) {
          $rootScope.messageError (err, '兑换网点删除失败，请稍后重试');
        });
    };
    //已下发的活动清除网点
    vm.clearStation_exchange = function () {
      Message.confirm('是否要清除以下全部网点？', '删除')
        .then(function () {
          ActivityService.sendUpdateActivityExchange(vm.id,vm.query4.keyWord,vm.query4.provinceId,vm.query4.cityId,vm.query4.stationId,vm.query4.stationType,vm.query4.flag)
            .then(function () {
              vm.query4.page_number=1;
              vm.getAddedList_ex();
              vm.clearStore_ex=true;//清除网点不可编辑
            })
            .catch(function (err) {
              $rootScope.messageError (err, '兑换网点删除失败，请稍后重试');
            });
        }).catch(function () {

      });

    };
    //分页
    vm.flip3= function (page_number) {
      vm.query3.page_number = page_number;
      vm.getAllList_ex();

    };
    vm.flip4= function (page_number) {
      vm.query4.page_number = page_number;
      vm.getAddedList_ex();
    };
    vm.AreaList_ex=[];//省份列表
    vm.CityList_ex=[];//城市列表
    vm.StoreList_ex=[];//网点列表

    vm.limit_ex=0;
    vm.limitif_ex='false';
    vm.changeLimit_ex = function(){
      if(vm.limitif_ex=='true'){
        vm.limit_ex=1;
      }else{
        vm.limit_ex=0;
      }
    };


    //添加兑换网点
    vm.addshop_ex=function () {
       vm.read = true;
      ActivityService.addActivityExchange(vm.id,vm.query3.stationId,vm.query3.keyWord,vm.query3.provinceId,vm.limit_ex,vm.query3.cityId,vm.query3.stationType)
        .then(function () {
          vm.read = false;
          vm.noAddedData_ex=false;
          vm.getAddedList_ex();
          vm.allStationList_ex=[];
          vm.addBtn_ex=true;
          vm.noData_ex=true;
         })
        .catch(function (err) {
          vm.read = false;
          $rootScope.catchError(err);
          return;
        });

    };

    /***********************************选择网店end*****************************************/

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

    
     /********************************************编辑***************************************/
    vm.saveBtn=false;//保存按钮不显示
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
    //提交
    vm.submit = function (state) {
      var active={
        activityId:vm.id,
        activityName:vm.list.activityName,
        activityStartDate:vm.list.activityStartDate,
        activityEndDate:vm.list.activityEndDate,
        activityQuota:vm.list.activityQuota,
        couponName:vm.list.couponName,
        couponContent:vm.list.couponContent,
        couponUnit:vm.list.couponUnit,
        expirationStatus:vm.list.expirationStatus,
        expirationDays:vm.list.expirationDays,
        expirationStartDate:vm.list.expirationStartDate,
        expirationEndDate:vm.list.expirationEndDate,
        reviewStatus:state,
        creatorId:$rootScope.userInfo.userId,
        creatorName:$rootScope.userInfo.userName,
        singleQuota:vm.list.singleQuota
      };
      vm.requesting = true;
      ActivityListService.update(active)
        .then(function () {
          Message.success('操作成功！');
          $state.go('tservice.activities');
        })
        .catch(function (err) {
          Message.error(err.message);
        })
        .then(function () {
          vm.requesting = false;
        });
    };
    //关闭新建消息页面
    vm.closeAdd = function (){
      $state.go('tservice.activitiesnewtwo',{id: vm.id, status: vm.actStatus});

    };



  }

})();
