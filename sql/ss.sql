/** 员工名册 **/
CREATE TABLE `ss_user` (
  `id` varchar(36) NOT NULL COMMENT '主键ID',
  `account` varchar(64) NOT NULL DEFAULT '' COMMENT '登录账户',
  `telephone` varchar(20) NOT NULL COMMENT '手机号码',
  `email` varchar(128) NOT NULL COMMENT '电子邮箱',
  `password` varchar(128) NOT NULL DEFAULT '密码',
  `salt` varchar(128) NOT NULL DEFAULT '加密盐',
  `name` varchar(64) NOT NULL DEFAULT '' COMMENT '真实姓名',
  `header` varchar(256) NOT NULL DEFAULT '',
  `sex` varchar(4) DEFAULT NULL,
  `birth` date DEFAULT NULL,
  `dept_id` int(11) DEFAULT NULL,
  `memo` varchar(256) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `create_user_id` varchar(64) DEFAULT NULL,
  `create_fullname` varchar(64) DEFAULT NULL,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `update_user_id` varchar(64) DEFAULT NULL,
  `update_fullname` varchar(64) DEFAULT NULL,
  `status` smallint(11) NOT NULL DEFAULT 1 COMMENT '用户状态：0-未启用，1-已启用 ，2-锁定，3-停用',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除：0-正常，1-已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
alter table `ss_user` add index idx_account(`account`);


/** 角色信息 **/
CREATE TABLE `ss_role` (
  `id` varchar(36) NOT NULL COMMENT '主键ID',
  `name` varchar(22) NOT NULL DEFAULT '' COMMENT '角色名称',
  `memo` varchar(128) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `create_user_id` varchar(64) DEFAULT NULL,
  `create_fullname` varchar(64) DEFAULT NULL,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `update_user_id` varchar(64) DEFAULT NULL,
  `update_fullname` varchar(64) DEFAULT NULL,
  `status` smallint(11) NOT NULL DEFAULT '1' COMMENT '用户状态：0-未启用，1-已启用',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除：0-正常，1-已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/** 用户角色 **/
CREATE TABLE `ss_user_role_map` (
  `id` varchar(36) NOT NULL COMMENT '主键ID',
  `user_id` varchar(36) NOT NULL COMMENT '用户ID',
  `role_id` varchar(36) NOT NULL COMMENT '角色ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `create_user_id` varchar(64) DEFAULT NULL,
  `create_fullname` varchar(64) DEFAULT NULL,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `update_user_id` varchar(64) DEFAULT NULL,
  `update_fullname` varchar(64) DEFAULT NULL,
  `status` smallint(11) NOT NULL DEFAULT 1 COMMENT '用户状态：0-未启用，1-已启用',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除：0-正常，1-已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
alter table `ss_user_role_map` add index idx_user_id(`user_id`);
alter table `ss_user_role_map` add index idx_role_id(`role_id`);

/** 系统模块表 **/
CREATE TABLE `ss_module` (
  `id` varchar(36) NOT NULL COMMENT '主键ID',
  `code` varchar(36) NOT NULL COMMENT '模块编码',
  `name` varchar(36) NOT NULL COMMENT '模块名称',
  `url` varchar(256) NOT NULL COMMENT '模块地址',
  `base_route` varchar(128) NOT NULL COMMENT '基础路由',
  `is_main` smallint NOT NULL DEFAULT 0 COMMENT '是否为主应用',
  `is_destroy` smallint NOT NULL DEFAULT 0 COMMENT '是否允许缓存',
  `order` smallint NULL DEFAULT 1 COMMENT '排序',
  `memo` varchar(200) NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `create_user_id` varchar(64) DEFAULT NULL,
  `create_fullname` varchar(64) DEFAULT NULL,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `update_user_id` varchar(64) DEFAULT NULL,
  `update_fullname` varchar(64) DEFAULT NULL,
  `status` smallint(11) NOT NULL DEFAULT 1 COMMENT '用户状态：0-未启用，1-已启用',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除：0-正常，1-已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/** 系统权限表 **/
CREATE TABLE `ss_permission` (
  `id` varchar(36) NOT NULL COMMENT '主键ID',
  `nav_id` varchar(36) NOT NULL COMMENT '导航ID',
  `code` varchar(36) NOT NULL COMMENT '权限code',
  `name` varchar(36) NOT NULL COMMENT '权限名称',
  `memo` varchar(200) NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `create_user_id` varchar(64) DEFAULT NULL,
  `create_fullname` varchar(64) DEFAULT NULL,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `update_user_id` varchar(64) DEFAULT NULL,
  `update_fullname` varchar(64) DEFAULT NULL,
  `status` smallint(11) NOT NULL DEFAULT 1 COMMENT '用户状态：0-未启用，1-已启用',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除：0-正常，1-已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
alter table `ss_permission` add index idx_nav_id(`nav_id`);

/** 系统角色权限关系表 **/
CREATE TABLE `ss_role_permission_map` (
  `id` varchar(36) NOT NULL COMMENT '主键ID',
  `role_id` varchar(36) NOT NULL COMMENT '角色ID',
  `permission_id` varchar(36) NOT NULL COMMENT '权限ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `create_user_id` varchar(64) DEFAULT NULL,
  `create_fullname` varchar(64) DEFAULT NULL,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `update_user_id` varchar(64) DEFAULT NULL,
  `update_fullname` varchar(64) DEFAULT NULL,
  `status` smallint(11) NOT NULL DEFAULT 1 COMMENT '用户状态：0-未启用，1-已启用',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除：0-正常，1-已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
alter table `ss_role_permission_map` add index idx_role_id(`role_id`);
alter table `ss_role_permission_map` add index idx_permission_id(`permission_id`);

/** 系统导航信息 **/
CREATE TABLE `ss_nav` (
  `id` varchar(36) NOT NULL COMMENT '主键ID',
  `module_id` varchar(36) NOT NULL COMMENT '模块ID',
  `pid` varchar(36) NULL COMMENT '导航上级ID',
  `pid_path` varchar(256) NULL COMMENT '导航ID路径',
  `code` varchar(36) NOT NULL COMMENT '导航编码',
  `name` varchar(64) NOT NULL DEFAULT '' COMMENT '导航名称',
  `icon` varchar(64) DEFAULT NULL COMMENT '图标',
  `path` varchar(128) DEFAULT NULL COMMENT '地址',
  `order` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  `memo` varchar(128) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `create_user_id` varchar(64) DEFAULT NULL,
  `create_fullname` varchar(64) DEFAULT NULL,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `update_user_id` varchar(64) DEFAULT NULL,
  `update_fullname` varchar(64) DEFAULT NULL,
  `status` smallint(11) NOT NULL DEFAULT 1 COMMENT '用户状态：0-未启用，1-已启用',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除：0-正常，1-已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/** 系统角色导航关系表 **/
CREATE TABLE `ss_role_nav_map` (
  `id` varchar(36) NOT NULL COMMENT '主键ID',
  `role_id` varchar(36) NOT NULL COMMENT '角色ID',
  `nav_id` varchar(36) NOT NULL COMMENT '导航ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `create_user_id` varchar(64) DEFAULT NULL,
  `create_fullname` varchar(64) DEFAULT NULL,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `update_user_id` varchar(64) DEFAULT NULL,
  `update_fullname` varchar(64) DEFAULT NULL,
  `status` smallint(11) NOT NULL DEFAULT 1 COMMENT '用户状态：0-未启用，1-已启用',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除：0-正常，1-已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
alter table `ss_role_nav_map` add index idx_role_id(`role_id`);
alter table `ss_role_nav_map` add index idx_nav_id(`nav_id`);