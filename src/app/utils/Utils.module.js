(function () {
    'use strict';
    angular.module('WeUtils', []);
  /**
   * 列表省略号方法  使用方法：{{some_text | cut:true:100:' ...'}}
   * @Author zhaoming@mapbar.com
   * @Date 2016/11/10 9:52
   */
  angular.module('WeViews').filter('cut', function () {
    return function (value, wordwise, max, tail) {
      if (!value) return '';

      max = parseInt(max, 10);
      if (!max) return value;
      if (value.length <= max) return value;

      value = value.substr(0, max);
      if (wordwise) {
        var lastspace = value.lastIndexOf(' ');
        if (lastspace != -1) {
          value = value.substr(0, lastspace);
        }
      }
      return value + (tail || ' …');
    };
  });
})();
