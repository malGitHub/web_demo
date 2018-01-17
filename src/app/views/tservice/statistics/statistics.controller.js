(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceStatisticsController', TserviceStatisticsController);

    /** @ngInject */
    function TserviceStatisticsController($uibModal,$compile,$window,Message,$scope,GetTemplateUrl,GetControllerName,$rootScope,StatisticsService,CustomerService,$timeout,DealorderService,PublicService,myParams,ActivityService) {
        var vm = this;
      vm.userId = $rootScope.userInfo.userId;
      vm.pageIndex = 1;
        vm.pageSize =10;
        vm.pageIndexTwo = 1;
        vm.pageSizeTwo =10;
        vm.pageIndexThr = 1;
        vm.pageSizeThr =10;
        vm.pageIndexFour = 1;
        vm.pageSizeFour =10;
        vm.flip = function (pageIndex) {
            vm.pageIndex = pageIndex;
            getList1();
        };
        vm.flipTwo = function (pageIndex) {
            vm.pageIndexTwo = pageIndex;
            getList2();
        };
        vm.flipThr = function (pageIndex) {
          vm.pageIndexThr = pageIndex;
          getList3();
        };
        vm.flipFour = function (pageIndex) {
          vm.pageIndexFour = pageIndex;
          getList4();
        };


      /********************************通用*********************************************************/
      /*默认第一个tab页显示*/
      vm.test=1;
      //工单类型下拉
      vm.ORDER_TYPE = [
        {val: '1', name: '进出站'},
        {val: '2', name: '外出救援'}
      ];
      //车辆系列
      StatisticsService.getSeriseList('10')
        .then(function (data) {
          vm.CAR_SERIES=data;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
      //区域
      CustomerService.getAreaList()
        .then(function (data) {
          vm.AreaListOne=data;
        })
        .catch(function (err) {
          $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
        });
      //弹出窗口数组
      vm.tabs1=[];
      vm.tabs2=[];

      /*固定的两个切换*/
      vm.toggle=function (index) {
        vm.cityParam='';
        vm.cityParam2='';
        angular.element(".nav-tabs").find("li").not(".fixed").removeClass("active");
        vm.test=index;
      };
      //清空所有active
      function clearActive() {
        angular.element(".nav-tabs").find("li").removeClass("active");
      }

      //删除数组中某一元素
      function removeByValue(arr, val) {
        for(var i=0; i<arr.length; i++) {
          if(arr[i] == val) {
            arr.splice(i, 1);
            break;
          }
        }
      }
      //判断数组中是否存在某一元素
      vm.hasValue=function(arr, val){
        for(var i=0; i<arr.length; i++) {
          if(arr[i] == val) {
            return true;
          }
        }
      };
      vm.removetab=function (e) {
        var param=e.target.attributes[2].value;
        if(e.target.parentElement.className.indexOf("active")!=-1){
          vm.toggle(1);
        }
        e.target.parentElement.remove();
        removeByValue(vm.tabs1, param);
      };
      //服务时长
      vm.servicetimeList=[{id:'1',name:'接站等待时长'},{id:'2',name:'检测时长'},{id:'3',name:'维修时长'},{id:'4',name:'完成确认时长'},{id:'0',name:'服务总时长'}];
      /********************************工单阶段统计start*****************************************************/
      //重置
      vm.clear1=function () {
        vm.query={province:'0',carSerise:'0',woType:'0',createTimeStart:'',createTimeEnd:''};
        vm.carSeriseName='';
        vm.province1='';
        vm.pageIndex = 1;
        vm.pageSize =10;
        vm.provinceName1='全国';
        getList1();
        getListTotal1()
      };
      vm.clear1();
      //通用筛选列表
      vm.forlist1=function () {
        vm.carSeriseName=vm.carSeriseName||{seriseName:'0',seriseId:'0'};
        vm.province1=vm.province1||{id:'0',name:'全国'};
        vm.pageIndex = 1;
        vm.query={province:vm.province1.id||'0',carSerise:vm.carSeriseName.seriseName||'0',woType:vm.query.woType||'0',createTimeStart:vm.query.createTimeStart||'',createTimeEnd:vm.query.createTimeEnd||''};
        getList1();
      };
      //筛选区域
      vm.changeProvince1=function () {
        vm.provinceName1=vm.province1.name;
        getListTotal1();
      };
      //点击tab标签
      vm.clickTab1=function () {
        vm.clear1();
        // getListTotal1();
        // getList1();
      };
      //列表数据1
      function getListTotal1() {
        CustomerService.woStageStatisticsTotal(vm.query.province)
          .then(function (data) {
            vm.mydata1Total=data
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          });
      }
      function getList1() {
        CustomerService.woStageStatistics(vm.pageIndex,vm.pageSize,vm.query)
          .then(function (data) {
            vm.mydata1=data.list;
            vm.total=data.total;
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          });
      }
      //导出
      vm.getExecl1=function () {
        var email='';
        CustomerService.AnalysisStagesExport(email,vm.query)
          .then(function(data){
             //window.open(data);
            Message.success("正在导出，请稍后");
            $timeout(function() {
              $window.location.href=data;
            },1000*10);
          })
          .catch(function(err){
            if(err.resultCode==530){
              $uibModal.open({
                templateUrl: GetTemplateUrl('tservice.statistics.email'),
                controller: GetControllerName('tservice.statistics.email'),
                controllerAs: 'vm',
                backdrop: false,
                resolve: {
                  query: function () {
                    return vm.query;
                  }
                }
              })
            }else{
              $rootScope.catchError(err);
            }
          })
      };
      /********************************工单阶段统计end*************************************************/

      /********************************服务时效统计start***********************************************/
      //重置
      vm.clear2=function () {
        vm.query2={woType:'0',carSerise:'0',province:'0',costTimeType:'0',costTime:'0',createTimeStart:'',createTimeEnd:''};
        vm.carSeriseName2='';
        vm.province2='';
        vm.provinceName2='全国';
        vm.pageIndexTwo = 1;
        vm.pageSizeTwo =10;
        vm.seriveName='服务总时长';
        vm.timelong='<24小时';
        vm.timelongList=[{id:'0',name:'<24小时'},{id:'1',name:'≥24小时'},{id:'2',name:'≥48小时'},{id:'3',name:'≥72小时'}];
        getList2();
        getListTotal2()
      };
      vm.clear2();

      //服务时长筛选
      vm.seriveName='服务总时长';
      vm.servicetimeChange=function (type) {
        vm.query2.costTime='0';
        if(type=='0'){
          vm.timelongList=[{id:'0',name:'<24小时'},{id:'1',name:'≥24小时'},{id:'2',name:'≥48小时'},{id:'3',name:'≥72小时'}];
        }else if(type=='1'||type=='2'||type=='3'||type=='4'){
          vm.timelongList=[{id:'0',name:'<0.5小时'},{id:'1',name:'≥0.5小时'},{id:'2',name:'≥1小时'},{id:'3',name:'≥1.5小时'},{id:'4',name:'≥2小时'},{id:'5',name:'≥3小时'},{id:'6',name:'≥4小时'}]
        }else{
          vm.timelongList=[];
        }
        vm.timelongChange();
        vm.servicetimeList.forEach(function (a) {
          if(a.id==vm.query2.costTimeType){
            vm.seriveName=a.name;
          }
        });
      };

      //时长筛选
      vm.timelong='<24小时';
      vm.timelongChange=function () {
        getList2();
        vm.timelongList.forEach(function (a) {
          if(a.id==vm.query2.costTime){
            vm.timelong=a.name;
          }
        });
        getListTotal2()
      };

      //通用筛选列表
      vm.forlist2=function () {
        vm.pageIndex = 1;
        vm.carSeriseName2=vm.carSeriseName2||{seriseName:'0',seriseId:'0'};
        vm.province2=vm.province2||{id:'0',name:'全国'};
        vm.query2={woType:vm.query2.woType||'0',carSerise:vm.carSeriseName2.seriseName||'0',province:vm.province2.id||'0',costTimeType:vm.query2.costTimeType||'0',costTime:vm.query2.costTime||'0',createTimeStart:vm.query2.createTimeStart||'',createTimeEnd:vm.query2.createTimeEnd||''};
        getList2();
      };
      //筛选区域
      vm.changeProvince2=function () {
        vm.provinceName2=vm.province2.name;
        getListTotal2();
      };
      //点击tab标签
      vm.clickTab2=function () {
        vm.clear2();
        // getListTotal2();
        // getList2();
      };
      //列表数据1
      function getListTotal2() {
        CustomerService.analysisTimelinessTotal(vm.query2.province,vm.query2.costTimeType,vm.query2.costTime)
          .then(function (data) {
            vm.mydata2Total=data.count
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          });
      }
      function getList2() {
        CustomerService.analysisTimeliness(vm.pageIndexTwo,vm.pageSizeTwo,vm.query2)
          .then(function (data) {
            vm.mydata2=data.list;
            vm.totalTwo=data.total;
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          });
      }

      //导出
      vm.getExecl2=function () {
        var email='';
        CustomerService.AnalysisTimelinessExport(email,vm.query2)
          .then(function(data){
             //window.open(data);
            Message.success("正在导出，请稍后");
            $timeout(function() {
              $window.location.href=data;
            },1000*10);
           })
          .catch(function(err){
            if(err.resultCode==530){
              $uibModal.open({
                templateUrl: GetTemplateUrl('tservice.statistics.email'),
                controller: GetControllerName('tservice.statistics.serveemail'),
                controllerAs: 'vm',
                backdrop: false,
                resolve: {
                  query: function () {
                    return vm.query2;
                  }
                }
              })
            }else{
              $rootScope.catchError(err);
            }
          })
      };
      /****************************************服务时效统计end******************************************/
      /********************************异常工单统计start***********************************************/

      //点击tab标签
      vm.clickTab5=function () {
        vm.clear5();
        // getWorkOrderList();
      };
      //列表数据1
      myParams.set({"nature":5});

      //重置
      vm.clear5=function () {
        vm.moreobject = false;
        vm.pageIndex5 = 1;
        vm.pageSize5 = 10;
        vm.provinceId='';
        vm.cityId='';
        vm.storeId='';
        vm.firstServiceType='';
        vm.serviceType='';
        vm.serviceTime='';

        vm.query5 = {
          keyword: "",
          orderType:"",
          orderStatus:"",
          satisfaction:"",
          operatorId:"",
          dateType:"",
          createTimeStart:"",
          createTimeEnd:""
        };
        getWorkOrderList();
      };
      vm.clear5();

      //工单类型
      vm.ORDER_TYPE = [
        {val: '1', name: '进出站'},
        {val: '2', name: '外出救援'}
      ];
      //工单状态
      vm.ORDER_STATE = [
        {val: '1', name: '待分派'},
        {val: '2', name: '待接车'},
        {val: '3', name: '检查中'},
        {val: '4', name: '维修中'},
        {val: '5', name: '完成待确认'},
        {val: '6', name: '待出站'},
        {val: '7', name: '已出站'},
        {val: '8', name: '取消预约'},
        {val: '9', name: '申请取消'},
        {val: '10', name: '取消服务'},
        {val: '11', name: '系统关闭'}
      ];
      //预约类型
      vm.SUBSCRIBE_TYPE = [
        {val: '1', name: '400电话'},
        {val: '2', name: 'APP预约'},
        {val: '3', name: '自主进站'}
      ];
      //服务类型
      vm.SERVICE_TYPE = [
        {val: '1', name: '检查阶段'},
        {val: '2', name: '维修阶段'}
      ];
      getProvince();
      function getProvince(){
        ActivityService.getAreaList()
          .then(function (data) {
            vm.AreaList=data;
          })
          .catch(function (err) {
            $rootScope.messageError (err, '获取省市下拉失败，请稍后重试');
          });
      }
      //一级服务类型下拉框选择操作
      vm.changeFirstServices=function(){
        vm.serviceType='';
        getWorkOrderList();
        if(vm.firstServiceType != '' && vm.firstServiceType != null) {
          //服务类型
          PublicService.basedata('A','A052')
            .then(function (data) {
              vm.ServicesList =data.list;
            }).catch(function (err) {
            $rootScope.catchError(err);
          });
        }else{
          vm.ServicesList = [];
        }
      };
      //服务类型下拉框选择操作
      vm.changeServices=function(){
        getWorkOrderList();
      };
      //省份选择操作
      vm.changeProvince=function(){

        if(vm.provinceId != '' && vm.provinceId != null) {
          //获取第二个下拉框（城市）
          ActivityService.getAreaList(vm.provinceId)
            .then(function (data) {
              getWorkOrderList();
              vm.CityList = data;
              vm.StoreList = [];
            })
            .catch(function (err) {
              $rootScope.messageError (err, '获取省市下拉失败，请稍后重试');
            });
        }else{
          vm.StoreList = [];
          vm.CityList = [];
          vm.cityId='';
          vm.storeId = '';
          getWorkOrderList();
        }
      };
      //城市下拉框选择操作
      vm.changeCity=function(){
        vm.StoreList=[];
        if(vm.provinceId != '' && vm.provinceId != null) {
          getStoreList();
        }
        getWorkOrderList();
      };
      //服务站下拉框选择操作
      function getStoreList(){
        if(vm.cityId!= '' && vm.cityId != null) {
          //获取网点下拉框
          ActivityService.getStoreList(vm.provinceId, vm.cityId, '2')
            .then(function (data) {
              vm.StoreList = data;
            })
            .catch(function (err) {
              $rootScope.messageError(err, '获取网点信息失败，请稍后重试');
            });
          getWorkOrderList();
        }else {
          vm.StoreList = [];
          vm.storeId = '';
          getWorkOrderList();
        }
      }
      vm.changeStore = function(){
        if(vm.storeId != null  && vm.storeId != ''){
          for(var i=0;i<vm.StoreList.length;i++){
            if(vm.storeId == vm.StoreList[i].stationId){
              vm.storeType = vm.StoreList[i].storeType;
              break;
            }
          }
        }
        getWorkOrderList();
      };
      //服务用时
      vm.FUWU_TIME = [
        {value: '1', name: '＜24小时'},
        {value: '2', name: '≥24小时'},
        {value: '3', name: '≥48小时'},
        {value: '4', name: '≥72小时'}
      ];
      //服务用时
      vm.servicesTime=function(){
        getWorkOrderList();
      };
      //服务类型
      vm.STAR_LEVEL = [
        {val: '5', name: '5.0'},
        {val: '4', name: '4.0'},
        {val: '3', name: '3.0'},
        {val: '2', name: '2.0'},
        {val: '1', name: '1.0'},
        {val: '0', name: '未评价'}
      ];

      DealorderService.QueryDealPeople($rootScope.userInfo.userId)
        .then(function (data) {
          vm.HANDLE_PERSON =data;
        }).catch(function (err) {
        $rootScope.catchError(err);
      });


      /**
       * 查询工单处理列表方法
       */
      function getWorkOrderList() {
        DealorderService.queryOrderAbnormalList(vm.pageIndex5, vm.pageSize5, vm.query5,vm.userId,vm.provinceId,vm.cityId,vm.storeId,vm.firstServiceType,vm.serviceType,vm.serviceTime)
          .then(function (data) {
            vm.sendMsgData = convert(data.list);
            vm.total5 = data.total;
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          });
      }

      /**
       * 高级查询与关键字查询方法
       */
      vm.advSearch = function () {
        vm.pageIndex5 = 1;
        getWorkOrderList();
      };

      /**
       * 数据转换
       * @param objs
       * @returns {*}
       */
      function convert(objs) {
        //var showData = [];
        angular.forEach(objs, function (data, index, arr) {
          var buttonShowFlg = {
            viewFlg:true,
            modifyFlg:false,
            replyFlg:false,
            sendFlg:false,
            cancelFlg:false,
            closeFlg:false,
            visitFlg:false
          };
          if(data.woStatus != null && data.woStatus != "") {/*&& data.useRole == '1001'*/
            if (data.woStatus == 1) {
              buttonShowFlg.sendFlg = true;
            }
            if (data.woStatus <= 2) {
              buttonShowFlg.cancelFlg = true;
            }
            if (data.woStatus <= 6) {
              buttonShowFlg.modifyFlg = true;
            }
            /* if ((data.woStatus == 5) || (data.woStatus == 6)) {
             buttonShowFlg.closeFlg = true;
             }*/
            if ((data.woStatus == 7)&& (data.userRate > 0) && (data.userRate <= 2) && (data.answerStatus != 1)) {
              buttonShowFlg.visitFlg = true;
            }
            if ((data.woStatus == 7) && (data.userRate == null)) {
              buttonShowFlg.visitFlg = true;
            }
            if (data.expertFlag == 0 && data.woStatus == 4) {
              buttonShowFlg.replyFlg = true;
            }
          }
          data.buttonShowFlg=buttonShowFlg;
        });
        return objs;
      }

      /**
       * 页码点击方法
       * @param pageIndex
       */
      vm.flip5 = function (pageIndex) {
        vm.pageIndex5 = pageIndex;
        getWorkOrderList();
      };

      /**
       * 显示高级选项方法
       */
      vm.formoreobj = function () {
        vm.moreobject = !vm.moreobject;
      };

      /**
       * 查看方法
       */
      vm.look = function(id){
        $state.go("tservice.dealorder.view");
      };


      /*导出*/
      vm.getExecl5=function () {
        var email='';
        DealorderService.exportOrderAbnormalList(email,vm.pageIndex5, vm.pageSize5, vm.query5,vm.userId,vm.provinceId,vm.cityId,vm.storeId,vm.firstServiceType,vm.serviceType,vm.serviceTime)
          .then(function(data){
            Message.success("正在导出，请稍后");
            $timeout(function() {
              $window.location.href=data;
            },1000*10);
          })
          .catch(function(err){
            if(err.resultCode==530){
              $uibModal.open({
                templateUrl: GetTemplateUrl('tservice.dealorder.email'),
                controller: GetControllerName('tservice.dealorder.email'),
                controllerAs: 'vm',
                backdrop: false,
                resolve: {
                  pageIndex: function () {return vm.pageIndex5;},
                  pageSize: function () {return vm.pageSize5;},
                  query: function () {return vm.query5;},
                  userId: function () {return vm.userId;},
                  provinceId: function () {return vm.provinceId;},
                  cityId: function () {return vm.cityId;},
                  storeId: function () {return vm.storeId;},
                  firstServiceType: function () {return vm.firstServiceType;},
                  serviceType: function () {return vm.serviceType;},
                  serviceTime: function () {return vm.serviceTime;}
                }
              })
            }else{
              $rootScope.catchError(err);
            }
          })
      };

      /****************************************异常工单统计end******************************************/
      /************************************阶段省份***********************************************/

      //工单阶段统计省份列表
      function getListTotal3() {
        CustomerService.woStageStatisticsTotal(vm.cityParam)
          .then(function (data) {
            vm.mydata1Total3=data
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          });
      }
      function getList3() {
        CustomerService.woStageStatisticsByProvince(vm.pageIndexThr,vm.pageSizeThr,vm.query3)
          .then(function (data) {
            vm.mydata3=data.list;
            vm.totalThr=data.total;
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          });
      }
      //重置
      vm.clear3=function () {
        vm.query3={province:vm.cityParam,carSerise:'0',woType:'0',createTimeStart:'',createTimeEnd:''};
        vm.carSeriseName3='';
        vm.pageIndexThr = 1;
        vm.pageSizeThr =10;
        getList3();
        getListTotal3();
      };
      //通用筛选列表
      vm.forlist3=function () {
        vm.pageIndexThr = 1;
        vm.carSeriseName3=vm.carSeriseName3||{seriseName:'0',seriseId:'0'};
        vm.query3={province:vm.cityParam,carSerise:vm.carSeriseName3.seriseName||'0',woType:vm.query3.woType||'0',createTimeStart:vm.query3.createTimeStart||'',createTimeEnd:vm.query3.createTimeEnd||''};
        getList3();
      };
      /*工单阶段统计添加新tab*/
      vm.add1=function (obj,id) {
        vm.cityParam=id;
        if(vm.hasValue(vm.tabs1,id)){
          vm.test=3;//显示工单子页
          vm.city1=obj;
          clearActive();
          var html=angular.element(".nav-tabs").find("li");
          for(var i=0;i<html.length;i++){
            var val=html[i].attributes[2].value;
            if(val==id){
              html[i].className="active";
              break
            }
          }
        }
        else{
          vm.test=3;//显示工单子页
          vm.city1=obj;
          vm.tabs1.push(id);
          clearActive();
          // 创建编译函数
          var compileFn = $compile('<li class="active" ng-click="statistics.show($event)" param="'+id+'"><a class="ng-binding" param="'+id+'">阶段统计_'+obj+'</a><span class="uib-tab-close" ng-click="statistics.removetab($event)" param="'+id+'">x</span></li>');
          // 传入scope，得到编译好的dom对象(已封装为jqlite对象)也可以用$scope.$new()创建继承的作用域
          var $dom = compileFn($scope);
          $dom.appendTo('.nav-tabs');// 添加到文档中
        }
        vm.query3={province:id,carSerise:'0',woType:'0',createTimeStart:'',createTimeEnd:''};
        getListTotal3();
        vm.clear3();
      };
      vm.show=function (e) {
        vm.cityParam2='';
        if(e.target.innerHTML=='x'){
          return false;
        }
        if(e.target.attributes[1].value==vm.cityParam){
          return false;
        }else{
          vm.cityParam=e.target.attributes[1].value;
        }
        clearActive();
        e.target.parentElement.className="active";
        vm.city1=e.target.innerHTML.split('_')[1];
        vm.test=3;
        vm.clear3();
        getListTotal3();
      };

      //导出
      vm.getExecl3=function () {
        var email='';
        CustomerService.woStageStatisticsByProvinceExport(email,vm.query3)
          .then(function(data){
             //window.open(data);
            Message.success("正在导出，请稍后");
            $timeout(function() {
              $window.location.href=data;
            },1000*10);
          })
          .catch(function(err){
            if(err.resultCode==530){
              $uibModal.open({
                templateUrl: GetTemplateUrl('tservice.statistics.email'),
                controller: GetControllerName('tservice.statistics.statisticemail'),
                controllerAs: 'vm',
                backdrop: false,
                resolve: {
                  query: function () {
                    return vm.query3;
                  }
                }
              })
            }else{
              $rootScope.catchError(err);
            }
          })
      };
      /************************************时效省份***********************************************/
      vm.query4={woType:'0',carSerise:'0',province:'0',costTimeType:'0',costTime:'0',createTimeStart:'',createTimeEnd:''};
      vm.carSeriseName4='';
      //时效省份列表查询
      function getListTotal4() {
        CustomerService.analysisTimelinessTotal(vm.cityParam2,vm.query4.costTimeType,vm.query4.costTime)
          .then(function (data) {
            vm.mydata4Total=data.count
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          });
      }
      function getList4() {
        CustomerService.analysisTimelinessByProvince(vm.pageIndexTwo,vm.pageSizeTwo,vm.query4)
          .then(function (data) {
            vm.mydata4=data.list;
            vm.totalFour=data.total;
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          });
      }
      //重置
      vm.clear4=function () {
        vm.query4={woType:'0',carSerise:'0',province:vm.cityParam2,costTimeType:'0',costTime:'0',createTimeStart:'',createTimeEnd:''};
        vm.carSeriseName4='';
        vm.pageIndexFour = 1;
        vm.pageSizeFour =10;
        vm.seriveName4='服务总时长';
        vm.timelong2='<24小时';
        vm.timelongList2=[{id:'0',name:'<24小时'},{id:'1',name:'≥24小时'},{id:'2',name:'≥48小时'},{id:'3',name:'≥72小时'}];
        getList4();
        getListTotal4();
      };
      //通用筛选列表
      vm.forlist4=function () {
        vm.pageIndexFour = 1;
        vm.carSeriseName4=vm.carSeriseName4||{seriseName:'0',seriseId:'0'};
        vm.query4={woType:vm.query4.woType||'0',carSerise:vm.carSeriseName4.seriseName||'0',province:vm.cityParam2,costTimeType:vm.query4.costTimeType||'0',costTime:vm.query4.costTime||'0',createTimeStart:vm.query4.createTimeStart||'',createTimeEnd:vm.query4.createTimeEnd||''};
        getList4();
      };
      vm.add2=function (obj,id) {
        vm.cityParam2=id;
        if(vm.hasValue(vm.tabs2,id)){
          vm.test=4;
          vm.city2=obj;
          clearActive();
          var html=angular.element(".nav-tabs").find("li");
          for(var i=0;i<html.length;i++){
            var val=html[i].attributes[2].value;
            if(val==id){
               html[i].className="active";
              break
            }
          }
        }
        else{
          vm.test=4;
          vm.city2=obj;
          clearActive();
          vm.tabs2.push(id);
          // 创建编译函数
          var compileFn = $compile('<li class="active" ng-click="statistics.show2($event)" param="'+id+'"><a class="ng-binding" param="'+id+'">时效统计_'+obj+'</a><span class="uib-tab-close" ng-click="statistics.removetab2($event)" param="'+id+'">x</span></li>');
          // 传入scope，得到编译好的dom对象(已封装为jqlite对象)也可以用$scope.$new()创建继承的作用域
          var $dom = compileFn($scope);
          $dom.appendTo('.nav-tabs');// 添加到文档中
        }
        getListTotal4();
        vm.clear4();
      };
      vm.show2=function (e) {
        vm.cityParam='';
        if(e.target.innerHTML=='x'){
          return false;
        }
        if(e.target.attributes[1].value==vm.cityParam2){
          return false;
        }else{
          vm.cityParam2=e.target.attributes[1].value;
        }
        angular.element(".nav-tabs").find("li").removeClass("active");
        e.target.parentElement.className="active";
        vm.city2=e.target.innerHTML.split('_')[1];
        vm.test=4;
        vm.clear4();
        getListTotal4();
      };
      vm.removetab2=function (e) {
        var param=e.target.attributes[2].value;
        if(e.target.parentElement.className.indexOf("active")!=-1){
          vm.toggle(2);
        }
        e.target.parentElement.remove();
        removeByValue(vm.tabs2, param);
      };

      //服务时长——省份
      vm.seriveName4='服务总时长';
      vm.servicetimeChange2=function (type) {
        vm.query4.costTime='0';
        if(type=='0'){
          vm.timelongList2=[{id:'0',name:'<24小时'},{id:'1',name:'≥24小时'},{id:'2',name:'≥48小时'},{id:'3',name:'≥72小时'}];
        }else if(type=='1'||type=='2'||type=='3'||type=='4'){
          vm.timelongList2=[{id:'0',name:'<0.5小时'},{id:'1',name:'≥0.5小时'},{id:'2',name:'≥1小时'},{id:'3',name:'≥1.5小时'},{id:'4',name:'≥2小时'},{id:'5',name:'≥3小时'},{id:'6',name:'≥4小时'}]
        }else{
          vm.timelongList2=[];
        }
        vm.timelongChange2();
        vm.servicetimeList.forEach(function (a) {
          if(a.id==vm.query4.costTimeType){
            vm.seriveName4=a.name;
          }
        });
      };
      //时长筛选
      vm.timelong2='<24小时';
      vm.timelongChange2=function () {
        getList4();
        vm.timelongList2.forEach(function (a) {
          if(a.id==vm.query4.costTime){
            vm.timelong2=a.name;
          }
        });
        getListTotal4();
      };
      vm.timelong2="<24小时";

      //导出
      vm.getExecl4=function () {
        var email='';
        CustomerService.analysisTimelinessByProvinceExport(email,vm.query4)
          .then(function(data){
             //window.open(data);
            Message.success("正在导出，请稍后");
            $timeout(function() {
              $window.location.href=data;
            },1000*10);
          })
          .catch(function(err){
            if(err.resultCode==530){
              $uibModal.open({
                templateUrl: GetTemplateUrl('tservice.statistics.email'),
                controller: GetControllerName('tservice.statistics.analysisemail'),
                controllerAs: 'vm',
                backdrop: false,
                resolve: {
                  query: function () {
                    return vm.query4;
                  }
                }
              })
            }else{
              $rootScope.catchError(err);
            }
          })
      };
    }
})();

