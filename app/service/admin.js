const Service = require('egg').Service

class UserService extends Service {
  /**
   * 登录
   * @date        2019-08-20
   * @author cnvp
   * @anotherdate 2019-08-20T08:44:43+0800
   * @param       {Object}                 param 请求参数对象
   */
  async login(param) {
    const { ctx, service } = this
    const user = await service.form.find('pt_user', { username: param.username })
    if (user) {
      return { token: user.ids }
    }
    ctx.throw(404, '未找到此用户')
  }

  // 创建和编辑角色权限信息
  async categoryPsermissin(param) {
    const { ctx, service } = this
    const cids = param.categoryids.split(',')
    let { id } = param
    let is_edit = true
    const module_info = await service.form.find('pt_module', { ids: param.moduleid })
    if (module_info) {
      const count = await service.form.count('pt_category')
      const category_list = await service.form.findAll('pt_category', null, ['id', 'postgroup'], [['listorder', 'asx'], ['id', 'desc']], count)
      if (id) {
        is_edit = true
        const role = await service.form.find(module_info.name, { id })
        if (!role) {
          ctx.throw(404, '未发现此角色')
        }
        await service.form.update(module_info.name, { name: param.name, description: param.description }, { id, catid: param.catid })
      } else {
        is_edit = false
        const time = new Date().getTime()
        id = ctx.helper.getToken(time)
        await service.form.create(module_info.name, { id, name: param.name, description: param.description, catid: param.catid })
      }
      const arr = category_list.map(item => {
        const postgroup = item.postgroup ? item.postgroup.split(',') : []
        const is_add = cids.indexOf(item.id.toString()) > -1
        const is_in_group = postgroup.indexOf(id) > -1 ? postgroup.indexOf(id) : false
        if (is_add) {
          if (is_in_group === false) {
            postgroup.push(id)
          }
        } else {
          if (is_in_group !== false) {
            postgroup.splice(is_in_group, 1)
          }
        }
        return { id: item.id, postgroup: postgroup.toString() }
      })
      await service.form.updateAll('pt_category', arr, null)
      if (is_edit) {
        return true
      } else {
        return id
      }
    } else {
      ctx.throw(404, '未找到此模型')
    }
  }

  // 删除角色信息以及该角色的栏目权限
  async deleteRolePsermissin(param) {
    const { ctx, service } = this
    const module_info = await service.form.find('pt_module', { ids: param.moduleid })
    if (module_info) {
      const count = await service.form.count('pt_category')
      const category_list = await service.form.findAll('pt_category', null, ['id', 'postgroup'], [['listorder', 'asx'], ['id', 'desc']], count)
      const is_delete = await service.form.delete(module_info.name, { id: param.id })
      const arr = category_list.map(item => {
        const postgroup = item.postgroup ? item.postgroup.split(',') : []
        let group = ''
        const is_in_group = postgroup.indexOf(param.id) > -1 ? postgroup.indexOf(param.id) : false
        if (is_in_group === false) {
          group = postgroup.toString()
        } else {
          postgroup.splice(is_in_group, 1)
          group = postgroup.toString()
        }
        return { id: item.id, postgroup: group }
      })
      await service.form.updateAll('pt_category', arr, null)
      if (is_delete.affectedRows > 0) {
        return true
      } else {
        ctx.throw(406, '删除角色失败!')
      }
    } else {
      ctx.throw(404, '未找到此模型')
    }
  }

  /**
   * 创建模型,初始化字段
   * @date        2019-08-20
   * @author cnvp
   * @anotherdate 2019-08-20T09:34:19+0800
   * @param       {Object}                 param 创建模型请求参数
   * @returns     {Number}                       正常时返回模型id，否则返回false
   */
  async createmodule(param) {
    const { ctx, service } = this
    const is_exits = await service.form.find('pt_module', { name: param.name })
    if (is_exits) {
      ctx.throw(405, `${param.name}已存在`)
      return false
    }
    const emptytable = param.emptytable || '0'
    const sql_createTable = await service.form.createTable(param.name, emptytable)
    await this.app.mysql.query(sql_createTable)
    const ids = ctx.helper.getToken(param.name)
    const is_create = await service.form.create('pt_module', { ids, title: param.title, type: emptytable, name: param.name, description: param.description, listfields: param.listfields })
    const sql_createDefaultField = await service.form.createDefaultField(ids, emptytable)
    await service.form.create('pt_field', sql_createDefaultField)
    if (is_create) {
      return ids
    }
    return false
  }

  /**
   * 更新模型信息
   * @date        2019-08-20
   * @author cnvp
   * @anotherdate 2019-08-20T13:50:42+0800
   * @param       {Object}                 param 请求参数对象
   * @returns     {Boolean}                       true=修改成功， false=修改失败
   */
  async updatemodule(param) {
    const { ctx, service } = this
    const module_info = await service.form.find('pt_module', { ids: param.moduleid })
    if (module_info) {
      if (module_info.name !== param.name) {
        await service.form.updateTableName(module_info.name, param.name)
      }
      const is_update = await service.form.update('pt_module', { name: param.name, title: param.title, description: param.description, listfields: param.listfields }, { ids: param.moduleid })
      if (is_update) {
        return true
      }
    } else {
      ctx.throw(404, '没有发现此模型')
    }
    return false
  }

  /**
   * 获取表的字段信息
   * @date        2019-08-20
   * @author cnvp
   * @anotherdate 2019-08-20T13:51:49+0800
   * @param       {String}                 name 表名
   * @returns     {Array}                      表的字段信息
   */
  async modulefieldlist(moduleid, is_field) {
    const { service } = this
    const obj = { moduleid, ispost: 1 }
    if (is_field) {
      delete obj.ispost
    }
    const field = await service.form.findAll('pt_field', obj, null, [['listorder', 'asc']])
    return field
  }
}

module.exports = UserService
