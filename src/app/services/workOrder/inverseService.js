/**
 * Created by yaocy on 2016/11/25.
 */
(function () {

  angular.module('WeServices')
    .provider('InverseService', function () {
      // var serviceUrl = '';
      var serviceUrl = 'https://wedrive.mapbar.com/sandbox/gis/api';
      var poiUrl = 'http://wedrive.mapbar.com/opentsp/gis/api';
      //var serviceUrl = 'http://10.102.95.17:8068/sandbox/gis/api';
      //var poiUrl = 'http://10.102.95.17:8068/opentsp/gis/api';
      function makeUrl(path) {
        return serviceUrl + path;
      }

      function makePoiUrl(path) {
        return poiUrl + path;
      }

      this.setServiceUrl = function (url) {
        if (url) {
          serviceUrl = url;
        }
      };

      this.$get = function ($q, $http) {
        return {
/*          //服务站查询
          inverse: function (opts) {
            return $http.get(
              makeUrl('/inverse?resType=json&road=1&ak=98f13846932a3a91e1e790d9c99cd8a9' + '&lat=' + opts.lat + '&lon=' + opts.lon)
            )
          },*/
          //服务站查询
          inverse: function (opts) {
            return $http.get(
              makePoiUrl('/inverse?resType=json&road=1&inGb=02&ak=79bd7f3bd5d240e888b2c84b4c3bc617' + '&lat=' + opts.lat + '&lon=' + opts.lon)
            )
          },
          /*通过关键字查区域*/
          getPoi: function (opts) {
            return $http.get(
              makePoiUrl('/search/geo?keywords=' + opts.keywords + '&search_type=' + opts.search_type + '&page_size=1&page_num=1&city=100000&ak=79bd7f3bd5d240e888b2c84b4c3bc617')
            )
          },
          /*通过关键字查坐标*/
          getPoiMore: function (opts) {
            return $http.get(
              makePoiUrl('/search/geo?keywords=' + opts.keywords + '&search_type=' + opts.search_type + '&city=100000&ak=79bd7f3bd5d240e888b2c84b4c3bc617')
            )
          },
          /*通过关键字查坐标*/
          suggest: function (opts) {
            return $http.get(
              makePoiUrl('/search/suggest?keywords=' + opts.keywords + '&city=100000'+ '&ak=79bd7f3bd5d240e888b2c84b4c3bc617')
            )
          },
          /*通过城市查坐标*/
          getDistrict: function (opts) {
            return $http.get(
              makePoiUrl('/search/geo?keywords=' + opts.keywords + '&city=' + opts.city + '&search_type=' + opts.search_type + '&page_size=1&page_num=1&ak=79bd7f3bd5d240e888b2c84b4c3bc617')
            )
          },
          /*通过省份查坐标*/
          getProvinceDistrict: function (opts) {
            return $http.get(
              makePoiUrl('/search/geo?keywords=' + opts.keywords + '&city=' + opts.province + '&search_type=' + opts.search_type + '&page_size=1&page_num=1&ak=79bd7f3bd5d240e888b2c84b4c3bc617')
            )
          }
        };
      };
    });
})();


