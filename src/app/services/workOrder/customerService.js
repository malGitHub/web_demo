/**
 * Created by wurui
 */
(function () {

  angular.module('WeServices')
    .provider('CustomerService', function () {
      var serviceUrl = '';
      // var serviceUrl = 'http://obdgsm.mapbar.com/t_manager';
      var templateUrl = {
        sim: '/files/bceebaac-3bec-47cc-938d-551a1888e5b6',
        base: '/files/8bd466cf-3319-4e04-bc5e-7eaa9f9d53ca'
      };

      var SC_STATUS, CHARGE_PLANS, OPERATORS, PACK_TYPE;

      function resolveBaseData(list) {
        if(list){
          return list.map(function (item) {
            return {
              key: item.value,
              value: item.name
            };
          });
        }else{
          return false;
        }
      }

      function makeUrl(path) {
        return serviceUrl + path;
        //return 'http://10.30.10.179:8090/qingqi/servicestation' + path;
      }

      this.setServiceUrl = function (url) {
        if (url) {
          serviceUrl = url;
        }
      };

      this.$get = function ($q, RequestService) {
        return {
          //by wurui 客服工单查询列表
          CustomerList: function (pageIndex,pageSize,filter,userId,provinceId,cityId,storeId) {
            return RequestService.get(
              makeUrl('/wo/query'),
              angular.merge({
                page_number:pageIndex,
                page_size:pageSize,
                userId:userId,
                provinceId:provinceId,
                cityId:cityId,
                storeId:storeId
              },filter)
            )
          },
          //by wurui 我要处理
          DealOrder: function (woId,dealer,dealername) {
            return RequestService.get(
              makeUrl('/wo/deal'),
              {
                woId:woId,
                dealer:dealer,
                dealName:dealername
              }
            )
          },
          //by wurui 处理工单，批量处理工单
          Distribute: function (woId,id,name) {
            return RequestService.get(
              makeUrl('/wo/distribute'),
              {
                woId:woId,
                dealer:id,
                dealName:name
              }
            )
          },
          //by wurui 关闭申请审核
          CloseOrder: function (userId,orderStatus,beforeOrderStatus,keyword,page_number,page_size,provinceId,cityId,storeId,serviceTime,startime,endtime) {
            return RequestService.get(
              makeUrl('/closeOrder/query'),
              {
                userId:userId,
                orderStatus:orderStatus,
                beforeOrderStatus:beforeOrderStatus,
                keyword:keyword,
                page_number:page_number,
                page_size:page_size,
                provinceId:provinceId,
                cityId:cityId,
                stationId:storeId,
                serviceTime:serviceTime,
                startDate:startime,
                endDate:endtime
              }
            )
          },
          //by wurui 修改工单状态
          ModifyWo: function (woCode,woStatus) {
            return RequestService.get(
              makeUrl('/wo/modifyWo'),
              {
                woCode:woCode,
                woStatus:woStatus
              }
            )
          },
          //by wurui 添加服务日志
          AddOperate: function (woCode,woStatus,vin,operatorId,operatorType,operateStatus,operateMsg) {
            return RequestService.get(
              makeUrl('/orderProcess/addOperate'),
              {
                woCode:woCode,
                woStatus:woStatus,
                vin:vin,
                operatorId:operatorId,
                operatorType:operatorType,
                operateStatus:operateStatus,
                operateMsg:operateMsg
              }
            )
          },
          //by wurui 获取处理人
          QueryWoProcessor: function (userId) {
            return RequestService.get(
              makeUrl('/wo/queryWoProcessor'),
              {
                userId:userId
              }
            )
          },
          //by wurui 获取处理人当前处理工单数
          GetWoCnt: function (userId) {
            return RequestService.get(
              makeUrl('/getWoCnt'),
              {
                userId:userId
              }
            )
          },
          /**************************************服务站统计*************************************/
          //服务统计分析目标车辆的总数-阶段
          woStageStatisticsTotal: function (province) {
            return RequestService.get(
              makeUrl('/woStageStatisticsTotal'),
              {
                province: province
              }
            );
          },
          //by wurui 工单时效统计列表导出
          AnalysisStagesExport: function (email,query) {
            return RequestService.get(
              makeUrl('/analysisStagesExport'),
              angular.merge({
                mailaddr:email
              },query)
            )
          },
          //服务统计分析列表-阶段
          woStageStatistics: function (page_number,page_size,query) {
            return RequestService.get(
              makeUrl('/woStageStatistics'),
              angular.merge({
                page_number: page_number,
                page_size: page_size
              },query)
            );
          },

          //服务统计分析列表-阶段
          woStageStatisticsByProvince: function (page_number,page_size,query) {
          return RequestService.get(
            makeUrl('/woStageStatisticsByProvince'),
            angular.merge({
              page_number: page_number,
              page_size: page_size
            },query)
          );
        },
          //服务统计分析列表-阶段导出
          woStageStatisticsByProvinceExport: function (email,query) {
            return RequestService.get(
              makeUrl('/woStageStatisticsByProvinceExport'),
              angular.merge({
                mailaddr:email
              },query)
            );
          },
          //服务统计分析-时效
          analysisTimeliness: function (page_number,page_size,query) {
            return RequestService.get(
              makeUrl('/analysisTimeliness'),
              angular.merge({
                page_number: page_number,
                page_size: page_size
              },query)
            );
          },
          //服务统计分析-时效
          analysisTimelinessByProvince: function (page_number,page_size,query) {
          return RequestService.get(
            makeUrl('/analysisTimelinessByProvince'),
            angular.merge({
              page_number: page_number,
              page_size: page_size
            },query)
          );
        },
          //服务统计分析-时效导出
          analysisTimelinessByProvinceExport: function (email,query) {
            return RequestService.get(
              makeUrl('/analysisTimelinessByProvinceExport'),
              angular.merge({
                mailaddr:email
              },query)
            );
          },
          //服务统计分析目标车辆的总数-阶段
          analysisTimelinessTotal: function (province,costTimeType,costTime) {
            return RequestService.get(
              makeUrl('/analysisTimelinessTotal'),
              {
                province: province||'0',
                costTimeType: costTimeType,
                costTime: costTime
              }
            );
          },
          //by wurui 工单时效统计列表导出
          AnalysisTimelinessExport: function (email,query) {
            return RequestService.get(
              makeUrl('/analysisTimelinessExport'),
              angular.merge({
                mailaddr:email
              },query)
            )
          },
          //获取下拉列表（省）
          getAreaList: function (provinceId) {
            return RequestService.get(
              makeUrl('/activity/queryArea'),
              {
                provinceId: provinceId
              }
            );
          },
          /**
           * 导出
           * @returns {url}
           */
          getExeclLink: function (email,query,filters) {
            return RequestService.get(
              makeUrl('/wo/export'),
              angular.merge({
                email:email,
                page_number:filters.pageIndex,
                page_size:filters.pageSize,
                userId:filters.userId,
                provinceId:filters.provinceId,
                cityId:filters.cityId,
                storeId:filters.storeId
              },query)
            )},

            /**
             * 关闭申请审核导出
             * @returns {url}
             */
            exportCloseOrderList: function (email,filters) {
              return RequestService.get(
                makeUrl('/closeOrder/exportCloseOrderList'),
                angular.merge({
                  email:email
                },filters)
              )}
        };
      };
    });
})();
