/*
SQLyog Ultimate v8.71 
MySQL - 5.5.5-10.1.8-MariaDB : Database - qy
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`qy` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `qy`;

/*Table structure for table `admin` */

DROP TABLE IF EXISTS `admin`;

CREATE TABLE `admin` (
  `uid` int(10) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `username` varchar(30) DEFAULT NULL COMMENT '用户名',
  `password` varchar(255) DEFAULT NULL COMMENT '用户密码',
  `role` varchar(10) NOT NULL COMMENT '角色',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`uid`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Table structure for table `article` */

DROP TABLE IF EXISTS `article`;

CREATE TABLE `article` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '文章id',
  `title` varchar(255) NOT NULL COMMENT '标题',
  `content` mediumtext COMMENT '内容',
  `desc` text COMMENT '介绍',
  `url` varchar(255) DEFAULT NULL COMMENT '链接',
  `thumb` varchar(255) DEFAULT NULL COMMENT '推荐图',
  `keywords` varchar(60) DEFAULT NULL COMMENT '关键字',
  `author` varchar(10) DEFAULT NULL COMMENT '作者',
  `importance` int(1) DEFAULT '0' COMMENT '重要性 0=默认值',
  `is_comment` tinyint(1) DEFAULT '0' COMMENT '是否允许评论',
  `attachment` varchar(255) DEFAULT NULL COMMENT '附件路径',
  `status` char(1) DEFAULT '0' COMMENT '状态值 0=未发布,1=已发布,2=已删除',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `send_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '发布时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Table structure for table `config` */

DROP TABLE IF EXISTS `config`;

CREATE TABLE `config` (
  `name` varchar(255) NOT NULL COMMENT '配置name',
  `title` varchar(255) DEFAULT NULL COMMENT '配置中文名',
  `value` mediumtext COMMENT '配置值',
  `desc` varchar(255) DEFAULT NULL COMMENT '配置描述',
  `remark` varchar(100) DEFAULT NULL COMMENT '备注信息',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建信息',
  `update_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*Table structure for table `novel_chapter` */

DROP TABLE IF EXISTS `novel_chapter`;

CREATE TABLE `novel_chapter` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '章节id',
  `n_id` int(10) DEFAULT NULL COMMENT '小说id',
  `title` varchar(100) NOT NULL COMMENT '章节标题',
  `content` mediumtext COMMENT '章节内容',
  PRIMARY KEY (`id`),
  KEY `index_chapter` (`n_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16772 DEFAULT CHARSET=utf8;

/*Table structure for table `novel_collect` */

DROP TABLE IF EXISTS `novel_collect`;

CREATE TABLE `novel_collect` (
  `n_id` int(10) NOT NULL COMMENT '收藏小说id',
  `openid` varchar(255) NOT NULL COMMENT '收藏用户',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '收藏时间',
  KEY `index_collect` (`n_id`,`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `novel_comment` */

DROP TABLE IF EXISTS `novel_comment`;

CREATE TABLE `novel_comment` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '评论id',
  `n_id` int(10) NOT NULL COMMENT '小说id',
  `openid` varchar(200) NOT NULL COMMENT '用户openid',
  `p_openid` varchar(200) DEFAULT NULL COMMENT '评论用户',
  `content` varchar(255) DEFAULT NULL COMMENT '评论内容',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '评论时间',
  PRIMARY KEY (`id`),
  KEY `index_commentlist` (`n_id`,`openid`,`p_openid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Table structure for table `novel_list` */

DROP TABLE IF EXISTS `novel_list`;

CREATE TABLE `novel_list` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '小说id',
  `name` varchar(50) DEFAULT NULL COMMENT '小说名',
  `cover` varchar(200) DEFAULT NULL COMMENT '封面',
  `desc` varchar(255) DEFAULT NULL COMMENT '介绍',
  `author` varchar(50) DEFAULT NULL COMMENT '作者',
  `source` varchar(10) DEFAULT NULL COMMENT '小说来源',
  `type` varchar(100) DEFAULT NULL COMMENT '小说类型',
  `num_click` int(10) DEFAULT '0' COMMENT '点击数',
  `num_hot` int(10) DEFAULT '0' COMMENT '人气数=收藏数+点击数+评论数',
  `num_collect` int(10) DEFAULT '0' COMMENT '收藏数',
  `size` int(10) NOT NULL DEFAULT '0' COMMENT '小说字数',
  `status` tinyint(4) DEFAULT '0' COMMENT '状态0=连载中,1=已完结',
  `is_charge` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否收费 0=不收费,1=收费',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `index_list` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

/*Table structure for table `novel_readlog` */

DROP TABLE IF EXISTS `novel_readlog`;

CREATE TABLE `novel_readlog` (
  `n_id` int(10) NOT NULL COMMENT '阅读小说id',
  `openid` varchar(100) NOT NULL COMMENT '用户唯一标识',
  `chapter_id` varchar(10) NOT NULL COMMENT '阅读小说的章节id',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '开始阅读时间',
  `update_time` timestamp NULL DEFAULT NULL COMMENT '最后阅读时间',
  KEY `index_user` (`n_id`,`openid`,`chapter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `novel_task` */

DROP TABLE IF EXISTS `novel_task`;

CREATE TABLE `novel_task` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '任务id',
  `name` varchar(50) DEFAULT NULL COMMENT '采集站点名称',
  `url` varchar(200) NOT NULL COMMENT 'url地址',
  `source` tinyint(4) NOT NULL COMMENT '采集来源',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '采集状态1=采集成功,2=采集失败',
  `type` tinyint(2) DEFAULT '1' COMMENT '小说类型',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=58744 DEFAULT CHARSET=utf8;

/*Table structure for table `novel_type` */

DROP TABLE IF EXISTS `novel_type`;

CREATE TABLE `novel_type` (
  `id` int(10) NOT NULL COMMENT '小说类型',
  `name` varchar(10) DEFAULT NULL COMMENT '类型名称',
  `alias` varchar(50) DEFAULT NULL COMMENT '别名',
  KEY `index_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `role` */

DROP TABLE IF EXISTS `role`;

CREATE TABLE `role` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '角色id',
  `name` varchar(10) DEFAULT NULL COMMENT '角色值',
  `alias` varchar(30) NOT NULL COMMENT '角色别名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Table structure for table `session` */

DROP TABLE IF EXISTS `session`;

CREATE TABLE `session` (
  `uid` int(10) NOT NULL COMMENT '用户id',
  `token` varchar(255) DEFAULT NULL COMMENT '用户token',
  `expire_in` varchar(10) DEFAULT NULL COMMENT '过期时间',
  `source` char(1) DEFAULT '1' COMMENT '1=浏览器登录,5=管理后台登录',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(255) NOT NULL AUTO_INCREMENT COMMENT '微信用户id',
  `unionid` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '开发平台唯一标识',
  `openid` varchar(100) CHARACTER SET utf8 NOT NULL COMMENT '用户openid，',
  `token` varchar(255) DEFAULT NULL COMMENT '用户唯一标识',
  `username` varchar(100) DEFAULT NULL COMMENT '用户名',
  `password` varchar(255) DEFAULT NULL COMMENT '用户密码',
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '用户昵称',
  `sex` char(1) CHARACTER SET utf8 DEFAULT '0' COMMENT '用户的性别，值为1时是男性，值为2时是女性，值为0时是未知',
  `language` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '用户的语言，简体中文为zh_CN',
  `city` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '用户所在城市',
  `province` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '用户所在省份',
  `country` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '用户所在国家',
  `headimgurl` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '用户头像',
  `groupid` varchar(20) CHARACTER SET utf8 DEFAULT NULL COMMENT '用户所在的分组ID',
  `remark` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '公众号运营者对粉丝的备注',
  `subscribe_scene` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '返回用户关注的渠道来源，ADD_SCENE_SEARCH 公众号搜索,ADD_SCENE_PROFILE_CARD 名片分享，ADD_SCENE_QR_CODE 扫描二维码',
  `tagid_list` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '用户被打上的标签ID列表',
  `qr_scene` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `qr_scene_str` varchar(64) CHARACTER SET utf8 DEFAULT NULL,
  `is_subscribe` char(0) CHARACTER SET utf8 DEFAULT NULL COMMENT '用户是否订阅该公众号标识，值为0时，代表此用户没有关注该公众号，拉取不到其余信息。',
  `status` char(0) CHARACTER SET utf8 DEFAULT NULL,
  `subscribe_time` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '用户最后关注时间',
  `acount` int(255) DEFAULT '30000' COMMENT '用户积分',
  `source` char(1) DEFAULT '0' COMMENT '用户来源 0=公众号 1=账号密码注册 2=小程序',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL COMMENT '更新时间或签到时间',
  PRIMARY KEY (`id`),
  KEY `index_user` (`token`(191),`openid`,`source`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `wx_menu` */

DROP TABLE IF EXISTS `wx_menu`;

CREATE TABLE `wx_menu` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(16) NOT NULL COMMENT '微信菜单名称',
  `type` char(10) DEFAULT 'click' COMMENT '菜单类型 click=按钮, view=链接,miniprogram=微信小程序',
  `key` varchar(50) DEFAULT NULL COMMENT '菜单KEY值，用于消息接口推送,click等点击类型必须',
  `is_first` char(1) DEFAULT '0' COMMENT '是否为一级菜单 1=一级菜单，其他表示其父级菜单id',
  `url` varchar(255) DEFAULT NULL COMMENT 'view、miniprogram类型必须 ，',
  `appid` varchar(50) DEFAULT NULL COMMENT '小程序appid ，miniprogram类型必须',
  `pagepath` varchar(100) DEFAULT NULL COMMENT '小程序秘钥,miniprogram类型必须',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Table structure for table `wx_message_reply` */

DROP TABLE IF EXISTS `wx_message_reply`;

CREATE TABLE `wx_message_reply` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `keywords` varchar(255) DEFAULT NULL COMMENT '接收的内容',
  `type` varchar(50) DEFAULT NULL COMMENT '接收用户消息类型，event=事件推送，text=被动回复',
  `type_event` varchar(50) DEFAULT NULL COMMENT '事件类型',
  `menu_key` varchar(50) DEFAULT NULL COMMENT '点击事件的菜单id值',
  `reply_type` varchar(10) DEFAULT 'text' COMMENT '回复类型 text=文本, image=图片',
  `reply_content` mediumtext COMMENT '回复内容，回复类型为image时,值为永久素材id',
  `remark` text COMMENT '备注',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
