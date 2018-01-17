(function () {
    'use strict';

    angular
        .module('WeServices')
        .provider('RuleService', function () {
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
                    /**
                     * 查询功能权限数据字典
                     * @param type
                     * @return {*}
                     */
                    qyeryFuncList: function (type) {
                        return RequestService.get(
                            makeUrl('/func/list'),
                            {
                                type: type
                            }
                        );
                    },
                    /**
                     * 添加角色
                     *
                     * @returns {*}
                     * @param name
                     * @param description
                     * @param funcIds
                     */
                    addRole: function (name, description, funcIds,userId) {
                        return RequestService.get(
                            makeUrl('/role/add'),
                            {
                                name: name,
                                description: description,
                                funcIds: funcIds,
                                creatorId:userId
                            }
                        )
                    },
                    /**
                     * 编辑角色
                     *
                     * @returns {*}
                     * @param name
                     * @param description
                     * @param funcIds
                     * @param id
                     */
                    editRole: function (name, description, funcIds, id,userId) {
                        return RequestService.get(
                            makeUrl('/role/update'),
                            {
                                id: id,
                                name: name,
                                description: description,
                                funcIds: funcIds,
                                creatorId:userId
                            }
                        )
                    },
                    /**
                     * 去创建者
                     * @param name
                     * @param description
                     * @param funcIds
                     * @returns {*}
                     */
                    getCreator: function () {
                        return RequestService.get(
                            makeUrl('/common/queryCreator4List'),
                            {
                                type: "B"
                            }
                        )
                    },
                    /**
                     * 删除角色
                     *
                     * @returns {*}
                     */
                    deleteRole: function (id) {
                        return RequestService.get(
                            makeUrl('/role/delete'),
                            {
                                id: id
                            }
                        )
                    },
                    /**
                     * 查询用户权限列表
                     */
                    getRuleList: function (keyword, rolelyDateStart,rolelyDateEnd, creator, pageIndex, pageSize) {
                        return RequestService.get(
                            makeUrl('/role/list'),
                            {
                                keyword: keyword,
                                createTimeStart: rolelyDateStart,
                                createTimeEnd: rolelyDateEnd,
                                creatorId: creator,
                                page_number: pageIndex,
                                page_size: pageSize
                            }
                        );
                    }
                };
            };
        });
})
();
