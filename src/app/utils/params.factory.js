(function () {
  'use strict';

  angular.module('WeViews').factory('myParams', function () {
    //定义factory返回对象
    var myServices = {};
    //定义参数对象
    var myObject = {};

    /**
     * 定义传递数据的set函数
     */
    var _set = function (data) {
      myObject = data;
    };

    /**
     * 定义获取数据的get函数
     */
    var _get = function () {
      return myObject;
    };
    /**
     * 定义清空数据的clear函数
     */
    var _clear = function () {
      myObject = {};
      return myObject;
    };
    // Public APIs
    myServices.set = _set;
    myServices.get = _get;
    myServices.clear = _clear;

    // 在controller中通过调set()，get()和clear()方法可实现提交或获取参数的功能
    return myServices;

  });
})();
