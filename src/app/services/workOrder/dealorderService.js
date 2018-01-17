/**
 * 工单处理服务类
 * @Author zhaoming@mapbar.com
 * @Date 2016/11/15 15:23
 */
(function() {
  angular.module("WeViews").provider("DealorderService", function () {

    var serviceUrl = '';

    function makeUrl(path) {
      return serviceUrl + path;
    }

    this.setServiceUrl = function (url) {
      if (url) {
        serviceUrl = url;
      }
    };

    this.$get = function ($q, RequestService) {
      return {
        //by wangshuai 工单处理列表
        WorkOrderList: function (pageIndex, pageSize, query,userId,provinceId,cityId,storeId,firstServiceType,serviceType,serviceTime) {
          return RequestService.get(
            makeUrl('/orderProcess/query'),
            angular.merge({
              page_number: pageIndex,
              page_size: pageSize,
              userId:userId,
              provinceId:provinceId,
              cityId:cityId,
              serviceStationId:storeId,
              firstServiceType:firstServiceType,
              serviceType:serviceType,
              serviceTime:serviceTime
            }, query)
          )
        },
        //by wangshuai 工单查看
        WorkOrderDetail: function (woCode) {
          return RequestService.get(
            makeUrl('/orderProcess/detail'),
            angular.merge({
              woCode: woCode
            })
          )
        },
        /*//by wangshuai 服务流程
        ProcessDetail: function (woCode) {
          return RequestService.get(
            makeUrl('/orderProcess/processDetail'),
            angular.merge({
              woCode: woCode
            })
          )
        },*/
        //by guodx 服务流程
        woOperateRecord: function (woCode) {
          return RequestService.get(
            makeUrl('/woOperateRecord'),
            angular.merge({
              woCode: woCode
            })
          )
        },
        //by wangshuai 评价查询
        RateDetail: function (woCode) {
          return RequestService.get(
            makeUrl('/orderProcess/rateDetail'),
            angular.merge({
              woCode: woCode
            })
          )
        },
        //by wangshuai 修改工单中400单号和备注
        ModifyOrder: function (woCode,csWoCode,comment) {
          return RequestService.get(
            makeUrl('/orderProcess/edit'),
            angular.merge({
              woCode: woCode,
              csWoCode:csWoCode,
              comment:comment
            })
          )
        },
        //by wangshuai 获取车辆位置及服务站位置
        GetLoc: function (woCode) {
          return RequestService.get(
            makeUrl('/orderProcess/getStationInfo'),
            angular.merge({
              woCode: woCode
            })
          )
        },
        //by wangshuai 变更工单预约服务站
        ChangeStation: function (woCode,stationId,stationName,stationAddress,stationLon,stationLat) {
          return RequestService.get(
            makeUrl('/orderProcess/updateWoStationInfo'),
            angular.merge({
              woCode: woCode,
              stationId:stationId,
              stationName:stationName,
              stationAddress:stationAddress,
              stationLon:stationLon,
              stationLat:stationLat
            })
          )
        },
        //by wangshuai 获取专家回复内容
        GetRecord: function (woCode,operatorType,operateStatus) {
          return RequestService.get(
            makeUrl('/orderProcess/operateDetail'),
            angular.merge({
              woCode: woCode,
              operatorType:operatorType,
              operateStatus:operateStatus
            })
          )
        },
        //by wangshuai 添加评论
        AddRate: function (woCode,stationId,driverId,score,content) {
          return RequestService.get(
            makeUrl('/orderProcess/rateAddByTBoss'),
            angular.merge({
              woCode: woCode,
              stationId:stationId,
              driverId:driverId,
              score:score,
              content:content
            })
          )
        },
        //by wangshuai 更改工单状态
        UpdateStatus: function (woCode,woStatus) {
          return RequestService.get(
            makeUrl('/wo/modifyWo'),
            angular.merge({
              woCode: woCode,
              woStatus:woStatus
            })
          )
        },
      //by wangshuai 评价查询
      GetRate: function (woCode) {
        return RequestService.get(
          makeUrl('/orderProcess/rateDetail'),
          angular.merge({
            woCode: woCode
          })
        )
      },
        //by wangshuai 添加服务日志
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
        //司机查询
        /*queryDriver: function (phone) {
          return RequestService.get(
            makeUrl('tocapp/queryDriverInfo'),
            angular.merge({
              userTel:phone
            })
          )
        },*/
        //更改工单回访状态为已回访
        UpdateAnswer: function (woCode) {
          return RequestService.get(
            makeUrl('/updateAnswerStatus'),
            angular.merge({
              woCode:woCode
            })
          )
        },
        //by wurui处理人
        QueryDealPeople: function (id) {
          return RequestService.get(
            makeUrl('/queryDealPeople'),
            angular.merge({
              userId: id
            })
          )
        },
        //by wurui 工单处理列表导出
        getExeclLink: function (email,pageIndex, pageSize, query,userId,provinceId,cityId,storeId,firstServiceType,serviceType,serviceTime) {
          return RequestService.get(
            makeUrl('/orderProcess/exportOrderProcessList'),
            angular.merge({
              email:email,
              page_number: pageIndex,
              page_size: pageSize,
              userId:userId,
              provinceId:provinceId,
              cityId:cityId,
              serviceStationId:storeId,
              firstServiceType:firstServiceType,
              serviceType:serviceType,
              serviceTime:serviceTime
            }, query)
          )
        },
        //by wurui 通过vin获取位置
        getPositionOfVIN: function (vin) {
          return RequestService.get(
            makeUrl('/getPositionOfVIN'),
            {
              vin:vin
            }
          )
        },
        //by WURUI 统计分析异常工单处理列表
        queryOrderAbnormalList: function (pageIndex, pageSize, query,userId,provinceId,cityId,storeId,firstServiceType,serviceType,serviceTime) {
          return RequestService.get(
            makeUrl('/queryOrderAbnormalList'),
            angular.merge({
              page_number: pageIndex,
              page_size: pageSize,
              userId:userId,
              provinceId:provinceId,
              cityId:cityId,
              serviceStationId:storeId,
              firstServiceType:firstServiceType,
              serviceType:serviceType,
              serviceTime:serviceTime
            }, query)
          )
        },
        //by wurui 统计分析异常工单工单处理列表导出
        exportOrderAbnormalList: function (email,pageIndex, pageSize, query,userId,provinceId,cityId,storeId,firstServiceType,serviceType,serviceTime) {
          return RequestService.get(
            makeUrl('/exportOrderAbnormalList'),
            angular.merge({
              email:email,
              page_number: pageIndex,
              page_size: pageSize,
              userId:userId,
              provinceId:provinceId,
              cityId:cityId,
              serviceStationId:storeId,
              firstServiceType:firstServiceType,
              serviceType:serviceType,
              serviceTime:serviceTime
            }, query)
          )
        },
        //by wurui 统计分析异常工单工单处理列表导出
        queryWoLoop: function (userId) {
          return RequestService.get(
            makeUrl('/queryWoLoop'),
            {
              userId:userId
            }
          )
        }

      }
    }

  })


})();
