/**
 * Created by wurui
 */
(function () {

  angular.module('WeServices')
    .provider('ActivityListService', function () {
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
          //by wurui 活动创建列表
          ActivitiesList: function (pageIndex,pageSize,filter) {
            return RequestService.get(
              makeUrl('/activity/query'),
              angular.merge({
                type:'1',
                page_number:pageIndex,
                page_size:pageSize
              },filter)
            )
          },
          sendactivities: function (activityId) {
            return RequestService.get(
              makeUrl('/activity/update'),
              {
                activityId: activityId,
                sendType:'1',
               }
            )
          },
          offlineactivities: function (activityId) {
            return RequestService.get(
              makeUrl('/activity/update'),
              {
                activityId: activityId,
                 offlineType:'1'
              }
            )
          },
          stopactivities: function (activityId) {
            return RequestService.get(
              makeUrl('/activity/update'),
              {
                activityId: activityId,
                stopType:'1'
              }
            )
          },
          //by wurui 活动删除
          activityDel: function (activityId) {
            return RequestService.get(
              makeUrl('/activity/del'),
              {
                activityId:activityId
              }
            )
          },
          //by wurui 活动详情
          activityDetail: function (activityId) {
            return RequestService.get(
              makeUrl('/activity/detail'),
              {
                activityId:activityId
              }
            )
          },
          addActivityRefresh: function (activityId) {
            return RequestService.get(
              makeUrl('/activity/addActivityRefresh'),
              {
                activityId:activityId
              }
            )
          },
          activityUpdate: function (obj) {
            return RequestService.get(
              makeUrl('/activity/update'),
              obj
            )
          },
          //by wurui 活动区域下拉列表
          queryArea: function (provinceId) {
            return RequestService.get(
              makeUrl('/activity/queryArea'),
              {
                provinceId:provinceId
              }
            )
          },
          queryAreaCity: function (provinceId) {
            return RequestService.get(
              makeUrl('/activity/queryArea'),
              {
                provinceId:provinceId
              }
            )
          },
          queryAreaShop: function (provinceId) {
            return RequestService.get(
              makeUrl('/activity/queryArea'),
              {
                provinceId:provinceId
              }
            )
          },
        queryStation: function (provinceId,cityId,type) {
          return RequestService.get(
            makeUrl('/activity/queryStation'),
            {
              provinceId:provinceId,
              cityId:cityId,
              type:type
            }
          )
        },
        //添加一个发放网店
        addActivityGrant: function (activityId,stationId,quota) {
          return RequestService.get(
            makeUrl('/activity/addActivityGrant'),
            {
              activityId:activityId,
              stationId:stationId,
              quota:quota
            }
          )
        },
       //删除一个发放网店
          delActivityGrant: function (activityId,stationId) {
            return RequestService.get(
              makeUrl('/activity/delActivityGrant'),
              {
                activityId:activityId,
                stationId:stationId,
              }
            )
          },
          //添加一个车型车系
          addSeries: function (activityId,series,model,seriesName,modelName) {
            return RequestService.post(
              makeUrl('/activity/addSeries'),
              {
                activityId:activityId,
                series:series,
                model:model,
                seriesName:seriesName,
                modelName:modelName

              }
            )
          },
          //删除一个车型车系
          delSeries: function (activityId,series,model) {
            return RequestService.get(
              makeUrl('/activity/delSeries'),
              {
                activityId:activityId,
                series:series,
                model:model
              }
            )
          },
          //by guodx 车辆底盘号的添加
          addCarChassisNum: function (activityId,chassisNum) {
            return RequestService.get(
              makeUrl('/activity/addCarChassisNum'),
              {
                activityId:activityId,
                chassisNum:chassisNum
              }
            )
          },
          //by guodx 车辆底盘号的导入
          carChassisNumUpload: function (uuid,fileType,activityId,carChassisNums) {
            return RequestService.post(
              makeUrl('/activity/carChassisNumUpload'),
              {
                uuid: uuid,
                fileType: fileType,
                activityId:activityId,
                chassisNums:carChassisNums
               }
            );
          },
          //by guodx 删除所选车型
          delExchangeSeries: function (activityId) {
            return RequestService.get(
              makeUrl('/activity/delExchangeSeries'),
              {
                activityId: activityId
               }
            );
          },
          //by guodx 删除特定车型
          delCarChassisNum: function (activityId,chassisNum) {
            return RequestService.get(
              makeUrl('/activity/delCarChassisNum'),
              {
                activityId: activityId,
                chassisNum: chassisNum
               }
            );
          },
          //兑换网点添加
          addActivityExchange: function (activityId,stationId,quota) {
            return RequestService.get(
              makeUrl('/activity/addActivityExchange'),
              {
                activityId:activityId,
                stationId:stationId,
                quota:quota
              }
            )
          },
          //兑换网点删除
          delActivityExchange: function (activityId,stationId) {
            return RequestService.get(
              makeUrl('/activity/delActivityExchange'),
              {
                activityId:activityId,
                stationId:stationId
              }
            )
          },
          //活动编辑
          update: function (active) {
            return RequestService.get(
              makeUrl('/activity/update'),
              active
            )
          }
        };
      };
    });
})();
