const Service = require('egg').Service

class FormService extends Service {
  // 查找所有的
  async findAll(name, condition = null, returnArr = null, orders = null, limit = 20, offset = 0) {
    const info = await this.app.mysql.select(name, { where: condition, columns: returnArr, orders: orders, limit: limit, offset: offset })
    return info
  }

  // 查找信息
  async find(name, condition, returnArr) {
    const info = await this.app.mysql.get(name, condition, { columns: returnArr })
    return info
  }

  // 查找数量
  async count(name, condition = null) {
    const count = await this.app.mysql.count(name, condition)
    return count
  }

  // 创建信息
  async create(name, data) {
    const info = await this.app.mysql.insert(name, data)
    return info
  }

  // 更新信息
  async update(name, data, condition) {
    const isUpdate = await this.app.mysql.update(name, data, { where: condition })
    return isUpdate
  }

  // 更新信息
  async updateAll(name, data, condition) {
    const isUpdate = await this.app.mysql.updateRows(name, data, { where: condition })
    return isUpdate
  }

  // 删除信息
  async delete(name, condition) {
    const isDelete = await this.app.mysql.delete(name, condition)
    return isDelete
  }

  // 模糊搜索
  async search(name, key, value, columns) {
    const keywords = this.app.mysql.escape('%' + value + '%')
    const sql = this.app.mysql.format(`SELECT ?? FROM ${name} WHERE ${key} LIKE ${keywords}`, [columns])
    const info = await this.app.mysql.query(sql)
    return info
  }

  // 多条件模糊查询
  async searchs(name, where_condition, where_info, columns, orderByString, limit = 20, offset = 0) {
    const obj = Object.assign({}, where_info)
    const arr = Object.keys(obj)
    const len = arr.length
    let str = ''
    let where_if = ''
    Object.keys(where_condition).map((key) => {
      where_if += `${key}=${where_condition[key]} `
    })
    if (len > 0) {
      Object.keys(obj).map((key) => {
        const is_or = arr[len - 1] === key ? '' : 'or '
        str += `${key} LIKE ${this.app.mysql.escape('%' + obj[key] + '%')} ${is_or}`
      })
    }
    const sql = this.app.mysql.format(`SELECT ?? FROM ${name} WHERE ${where_if} ${str ? ('AND ' + str) : ''} order by ${orderByString} LIMIT ${offset} , ${limit}`, [columns])
    const list = await this.app.mysql.query(sql)
    return list
  }

  // 模糊查询的数量
  async likeCount(name, where_condition, where_info) {
    const obj = Object.assign({}, where_info)
    const arr = Object.keys(obj)
    const len = arr.length
    let str = ''
    let where_if = ''
    Object.keys(where_condition).map((key) => {
      where_if += `${key}=${where_condition[key]} `
    })
    if (len > 0) {
      Object.keys(obj).map((key) => {
        const is_or = arr[len - 1] === key ? '' : 'or '
        str += `${key} LIKE ${this.app.mysql.escape('%' + obj[key] + '%')} ${is_or}`
      })
    }
    const sql = this.app.mysql.format(`SELECT count(1) FROM ${name} WHERE ${where_if} ${str ? ('AND ' + str) : ''} `)
    const count = await this.app.mysql.query(sql)
    return Object.values(count[0])[0]
  }

  // 最近几个月的数据
  async findMonth(name, returnArr = '*', month_num, time_field) {
    const info = await this.app.mysql.query(`SELECT ${returnArr.toString()} FROM ${name} WHERE DATE_SUB(CURDATE(), INTERVAL ${month_num} MONTH) <= date(${time_field})`)
    return info
  }

  // 最近几个月的数量
  async countMonth(name, month_num, time_field) {
    const num = await this.app.mysql.query(`SELECT COUNT(*) AS count FROM ${name} WHERE DATE_SUB(CURDATE(), INTERVAL ${month_num} MONTH) <= date(${time_field})`)
    if (num[0]) {
      return num[0].count
    }
    return 0
  }

  async field(name) {
    const config = this.config
    const { database: db_name } = config.mysql.client
    const field = await this.app.mysql.query(`select COLUMN_NAME as name, DATA_TYPE as data_type, COLUMN_TYPE as lentype, COLUMN_COMMENT as comments, ORDINAL_POSITION as listorder from information_schema.COLUMNS where table_name = '${name}' and table_schema = '${db_name}'`)
    // const field = await this.app.mysql.query(`SELECT COLUMN_NAME AS name,if( COLUMN_COMMENT is null or COLUMN_COMMENT='', COLUMN_NAME, COLUMN_COMMENT) AS namecn FROM information_schema.COLUMNS WHERE TABLE_NAME='${name}'`)
    return field
  }

  // 连表查询
  async finds(param) {
    await this.app.mysql.query('SELECT a.nickName,a.avatarUrl,b.star_level,b.tel,b.pre_time, b.id, b.uid, b.longitude, b.latitude, b.status, b.result, b.create_time, b.update_time  FROM user_info  a, y_pre_info b WHERE a.id=b.uid AND b.result=? ORDER BY b.id DESC LIMIT ? , ?', [param.result, param.offset, parseInt(param.limit)])
  }

  // 创建表 tablename=表名， tableType=1 创建空表  0=创建数据列表
  async createTable(tablename, tableType) {
    let sql = ''
    if (tableType === '0') {
      sql += `CREATE TABLE ${tablename} (`
      sql += `id int(11) unsigned NOT NULL AUTO_INCREMENT,`
      sql += `catid smallint(5) unsigned NOT NULL DEFAULT '0',`
      sql += `userid int(8) unsigned NOT NULL DEFAULT '0',`
      sql += `username varchar(40) NOT NULL DEFAULT '',`
      sql += `title varchar(120) NOT NULL DEFAULT '',`
      sql += `title_style varchar(40) NOT NULL DEFAULT '',`
      sql += `thumb varchar(100) NOT NULL DEFAULT '',`
      sql += `keywords varchar(120) NOT NULL DEFAULT '',`
      sql += `description mediumtext NOT NULL,`
      sql += `content mediumtext NOT NULL,`
      sql += `url varchar(60) NOT NULL DEFAULT '',`
      sql += `template varchar(40) NOT NULL DEFAULT '',`
      sql += `posid tinyint(2) unsigned NOT NULL DEFAULT '0',`
      sql += `status tinyint(1) unsigned NOT NULL DEFAULT '0',`
      sql += `recommend tinyint(1) unsigned NOT NULL DEFAULT '0',`
      sql += `readgroup varchar(100) NOT NULL DEFAULT '',`
      sql += `readpoint smallint(5) NOT NULL DEFAULT '0',`
      sql += `listorder int(10) unsigned NOT NULL DEFAULT '0',`
      sql += `hits int(11) unsigned NOT NULL DEFAULT '0',`
      sql += `createtime int(11) unsigned NOT NULL DEFAULT '0',`
      sql += `updatetime int(11) unsigned NOT NULL DEFAULT '0',`
      sql += `PRIMARY KEY (id),`
      sql += `KEY status (id,status,listorder),`
      sql += `KEY catid (id,catid,status),`
      sql += `KEY listorder (id,catid,status,listorder)`
      sql += `) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;`
    } else if (tableType === '1') {
      sql += `CREATE TABLE ${tablename} (`
      sql += `id int(11) unsigned NOT NULL AUTO_INCREMENT,`
      sql += `userid int(8) unsigned NOT NULL DEFAULT '0',`
      sql += `url varchar(60) NOT NULL DEFAULT '',`
      sql += `listorder int(10) unsigned NOT NULL DEFAULT '0',`
      sql += `createtime int(11) unsigned NOT NULL DEFAULT '0',`
      sql += `updatetime int(11) unsigned NOT NULL DEFAULT '0',`
      sql += `status tinyint(1) unsigned NOT NULL DEFAULT '0',`
      sql += `PRIMARY KEY (id)`
      sql += `) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;`
    } else if (tableType === '2') {
      sql += `CREATE TABLE ${tablename} (`
      sql += `id int(11) unsigned NOT NULL AUTO_INCREMENT,`
      sql += `catid smallint(5) unsigned NOT NULL DEFAULT '0',`
      sql += `parentid int(11) unsigned NOT NULL DEFAULT '0',`
      sql += `name varchar(40) NOT NULL DEFAULT '',`
      sql += `listorder int(10) unsigned NOT NULL DEFAULT '0',`
      sql += `PRIMARY KEY (id)`
      sql += `) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;`
    }
    return sql
  }

  // 修改表名
  async updateTableName(oldTableName, newTableName) {
    const update_table = await this.app.mysql.query(`ALTER TABLE ${oldTableName} RENAME TO ${newTableName}`)
    return update_table
  }

  // 删除表
  async deleteTable(tableName) {
    const delete_table = await this.app.mysql.query(`DROP TABLE IF EXISTS ${tableName}`)
    return delete_table
  }

  // 删除字段
  async deleteField(tablename, field) {
    const delete_field = await this.app.mysql.query(`ALTER TABLE ${tablename} DROP ${field}`)
    return delete_field
  }

  // 创建默认表字段
  async createDefaultField(moduleid, tableType) {
    let sql = []
    if (tableType === '0') {
      sql = [{
        moduleid,
        field: 'catid',
        name: '栏目',
        tips: '',
        required: 1,
        minlength: 1,
        maxlength: 6,
        pattern: 'digits',
        errormsg: '',
        classname: '',
        type: 'catid',
        setup: '',
        ispost: 1,
        unpostgroup: '',
        listorder: 0,
        status: 1,
        issystem: 1
      }, {
        moduleid,
        field: 'title',
        name: '标题',
        tips: '',
        required: 1,
        minlength: 3,
        maxlength: 80,
        pattern: '',
        errormsg: '标题必填3-80个字',
        classname: '',
        type: 'title',
        setup: '{"thumb": "1", "style": "1", "size": "55"}',
        ispost: 1,
        unpostgroup: '',
        listorder: 0,
        status: 1,
        issystem: 1
      }, {
        moduleid,
        field: 'createtime',
        name: '创建时间',
        tips: '',
        required: 1,
        minlength: 0,
        maxlength: 0,
        pattern: '',
        errormsg: '',
        classname: '',
        type: 'datetime',
        setup: '',
        ispost: 1,
        unpostgroup: '',
        listorder: 0,
        status: 1,
        issystem: 1
      }, {
        moduleid,
        field: 'readpoint',
        name: '访问权限',
        tips: '',
        required: 0,
        minlength: 0,
        maxlength: 0,
        pattern: '',
        errormsg: '',
        classname: '',
        type: 'groupid',
        setup: '{"inputtype": "heckbox", "fieldtype": "inyint", "labelwidth": "5", "default": ""}',
        ispost: '',
        unpostgroup: '',
        listorder: 0,
        status: 1,
        issystem: 1
      }, {
        moduleid,
        field: 'status',
        name: '状态',
        tips: '',
        required: '',
        minlength: 0,
        maxlength: 0,
        pattern: '',
        errormsg: '',
        classname: '',
        type: 'radio',
        setup: '{"options": "发布|1\r\n定时发布|0", "fieldtype": "tinyint", "numbertype": "1", "labelwidth": "75", "default": "1"}',
        ispost: '',
        unpostgroup: '',
        listorder: 0,
        status: 1,
        issystem: 0
      }]
    } else if (tableType === '1') {
      sql = [{
        moduleid,
        field: 'createtime',
        name: '创建时间',
        tips: '',
        required: 1,
        minlength: 0,
        maxlength: 0,
        pattern: '',
        errormsg: '',
        classname: '',
        type: 'datetime',
        setup: '',
        ispost: 1,
        unpostgroup: '',
        listorder: 0,
        status: 1,
        issystem: 1
      }, {
        moduleid,
        field: 'status',
        name: '状态',
        tips: '',
        required: '',
        minlength: 0,
        maxlength: 0,
        pattern: '',
        errormsg: '',
        classname: '',
        type: 'radio',
        setup: '{"options": "发布|1\r\n定时发布|0", "fieldtype": "tinyint", "numbertype": "1", "labelwidth": "75", "default": "1"}',
        ispost: '',
        unpostgroup: '',
        listorder: 0,
        status: 1,
        issystem: 0
      }]
    } else if (tableType === '2') {
      sql = [{
        moduleid,
        field: 'name',
        name: '名称',
        tips: '',
        required: 1,
        minlength: 3,
        maxlength: 80,
        pattern: '',
        errormsg: '名称必填3-80个字',
        classname: '',
        type: 'text',
        setup: '{"thumb": "1", "style": "1", "size": "55"}',
        ispost: 1,
        unpostgroup: '',
        listorder: 0,
        status: 1,
        issystem: 0
      }]
    }
    return sql
  }

  // 获取表sql语句 客户端数据， way，操作方式 add = 添加 否则为更新
  async get_tablesql(param, way) {
    const { moduleid, field, oldfield } = param
    let { type: fieldtype, maxlength } = param
    if (param['setup']['fieldtype']) {
      fieldtype = param['setup']['fieldtype']
    }
    let _default = param['setup']['default']
    const module_info = await this.find('pt_module', { ids: moduleid })
    const tablename = module_info.name
    maxlength = parseInt(maxlength)
    let sql = ''
    const numbertype = param['setup']['numbertype']
    if (way === 'add') {
      way = ' ADD '
    } else {
      way = ` CHANGE ${oldfield} `
    }

    switch (fieldtype) {
      case 'varchar':
        if (!maxlength) maxlength = 255
        maxlength = Math.min.apply(null, [maxlength, 255])
        sql = `ALTER TABLE ${tablename} ${way} ${field} VARCHAR( ${maxlength} ) NOT NULL DEFAULT ${_default};`
        break

      case 'title':
        if (!maxlength) maxlength = 255
        maxlength = Math.min.apply(null, [maxlength, 255])
        sql += `ALTER TABLE ${tablename} ${way} title VARCHAR( ${maxlength} ) NOT NULL DEFAULT ${_default};`
        sql += `ALTER TABLE ${tablename} ${way} title_style VARCHAR( 40 ) NOT NULL DEFAULT;`
        sql += `ALTER TABLE ${tablename} ${way} thumb VARCHAR( 100 ) NOT NULL DEFAULT;`
        break

      case 'catid':
        sql = `ALTER TABLE ${tablename} ${way} ${field} SMALLINT(5) UNSIGNED NOT NULL DEFAULT '0'`
        break

      case 'number':
      {
        const decimaldigits = param['setup']['decimaldigits']
        _default = decimaldigits === 0 ? parseInt(_default) : parseFloat(_default)
        sql = `ALTER TABLE ${tablename} ${way} ${field} ${(decimaldigits === 0 ? 'INT' : 'decimal( 10, ' + decimaldigits + ' )')} ${(numbertype === 1 ? 'UNSIGNED' : '')} NOT NULL DEFAULT ${_default}`
        break
      }

      case 'tinyint':
        if (!maxlength) maxlength = 3
        maxlength = Math.min.apply(null, [maxlength, 3])
        _default = parseInt(_default)
        sql = `ALTER TABLE ${tablename} ${way} ${field} TINYINT( ${maxlength} ) ${(numbertype === 1 ? 'UNSIGNED' : '')} NOT NULL DEFAULT ${_default}`
        break

      case 'smallint':
        _default = parseInt(_default)
        if (!maxlength) maxlength = 8
        maxlength = Math.min.apply(null, [maxlength, 8])
        sql = `ALTER TABLE ${tablename} ${way} ${field} SMALLINT( ${maxlength} ) ${(numbertype === 1 ? 'UNSIGNED' : '')}
        " NOT NULL DEFAULT _default`
        break

      case 'int':
        _default = parseInt(_default)
        sql = `ALTER TABLE ${tablename} ${way} ${field} INT ${(numbertype === 1 ? 'UNSIGNED' : '')} NOT NULL DEFAULT ${_default}`
        break

      case 'mediumint':
        _default = parseInt(_default)
        sql = `ALTER TABLE ${tablename} ${way} ${field} INT ${(numbertype === 1 ? 'UNSIGNED' : '')} NOT NULL DEFAULT ${_default}`
        break

      case 'mediumtext':
        sql = `ALTER TABLE ${tablename} ${way} ${field} MEDIUMTEXT NOT NULL`
        break

      case 'text':
        sql = `ALTER TABLE ${tablename} ${way} ${field} TEXT NOT NULL`
        break

      case 'posid':
        sql = `ALTER TABLE ${tablename} ${way} ${field} TINYINT(2) UNSIGNED NOT NULL DEFAULT '0'`
        break

        // case 'typeid':
        // sql = "ALTER TABLE ${tablename} ${way} ${field} SMALLINT(5) UNSIGNED NOT NULL DEFAULT '0'"
        // break
      case 'datetime':
        sql = `ALTER TABLE ${tablename} ${way} ${field} INT(11) UNSIGNED NOT NULL DEFAULT '0'`
        break

      case 'editor':
        sql = `ALTER TABLE ${tablename} ${way} ${field} TEXT NOT NULL`
        break

      case 'image':
        sql = `ALTER TABLE ${tablename} ${way} ${field} VARCHAR( 80 ) NOT NULL DEFAULT ''`
        break

      case 'images':
        sql = `ALTER TABLE ${tablename} ${way} ${field} MEDIUMTEXT NOT NULL`
        break

      case 'file':
        sql = `ALTER TABLE ${tablename} ${way} ${field} VARCHAR( 80 ) NOT NULL DEFAULT ''`
        break

      case 'files':
        sql = `ALTER TABLE ${tablename} ${way} ${field} MEDIUMTEXT NOT NULL`
        break
    }
    return sql
  }
}

module.exports = FormService
