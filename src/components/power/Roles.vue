<template>
  <div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  
</el-breadcrumb>
<el-card>
  <el-row>
  <el-col>
    <el-button type='primary'>添加角色</el-button>
  </el-col>
  </el-row>

  <el-table :data='rolelist' border stripe>
    <el-table-column type='expand'>
      <template slot-scope="scope">
        <el-row v-for='(item1,i1) in scope.row.children' :key='item1.id' :class='["bdbottom", i1===0 ? "bdtop" :"","vcenter"]'>
          <el-col :span='5' >
            <el-tag>{{item1.authName}}</el-tag>
            <i class='el-icon-caret-right'></i>
          </el-col>
          <el-col :span='19'>
            <el-row v-for='(item2,i2) in item1.children' :key='item2.id'  :class='[i2==0 ? "" : "bdtop" ,"vcenter"]'>
              <el-col :span='6'>
              <el-tag type='success'>{{item1.authName}}</el-tag>
            <i class='el-icon-caret-right'></i>
            </el-col>
            <el-col :span='18'>
              <el-tag type='warning' v-for='(item3,i3) in item2.children' :key='item3.id' @close='removeRightById(scope.row,item3.id)' closable>
                {{item3.authName}}
              </el-tag>
            </el-col>
            </el-row>
          </el-col>
        </el-row>
      <pre>
        {{scope.row}}
      </pre>
       </template>
    </el-table-column>
    

   
    <el-table-column type='index' ></el-table-column>
    <el-table-column label='角色名称' prop='roleName' ></el-table-column>
    <el-table-column label='角色描述' prop='roleDesc'></el-table-column>
    <el-table-column label='操作'  >
      <template slot-scope="scope">
        <el-button size='mini' type='primary' icon='el-icon-edit'>编辑</el-button>
        <el-button size='mini' type='danger' icon='el-icon-delete'>删除</el-button>
        <el-button size='mini' type='warning' icon='el-icon-setting' @click='showSetRightDialog(scope.row)'>分配</el-button>
      </template>
    </el-table-column>

  </el-table>

</el-card>

<el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="50%"
  @close='setRightDialogClosed'
  >
  <el-tree :data='rightlist' :props='treeProps' show-checkbox node-key='id' default-expand-all
  :default-checked-keys="defKeys" ref='treeRef'></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      rolelist:[],
      rightlist:[],
      setRightDialogVisible:false,
      treeProps:{
        label:'authName',
        children:'children'
      },
      defKeys:[],
      roleId:''


    }
  },
  created(){
    this.getRolesList()

  },
  methods:{
    async getRolesList(){
      const {data:res}=await this.$http.get('roles')
      if(res.meta.status!==200){
        return this.$message.error('获取角色列表失败')
      }
     this.rolelist=res.data
     console.log(this.getRolesList)
      

    },
    async removeRightById(role,rightId){
      const confirmResult = await 
      this.$confirm(
        '此操作将删除此文件，是否继续',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText:'取消',
          type:'warning'
        }
      ).catch(err=>err)
      if(confirmResult !== 'confirm'){
        return this.$message('取消了删除')
      }
      const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
    if(res.meta.status!==200){
       return this.$message.error('删除失败')
     }
     role.children=res.data
    },
    async showSetRightDialog(role){
      this.roleId=role.id
      const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status!==200){
        return this.$message.error('获取数据失败')
      }
     
      this.rightlist=res.data
      this.getleafKeys(role,this.defKeys)
       this.setRightDialogVisible=true
      
    },
    getleafKeys(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }

      node.children.forEach(item => 
          this.getleafKeys(item,arr))

    },
    setRightDialogClosed(){
      this.defKeys=[]
    },
    async allotRights(){
      const keys=[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
       const idStr =keys.join(',')
       const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
       if(res.meta.status != 200){
         return this.$message.error('分配失败')
       }
       this.$message.success('分配成功')
       this.getRolesList()
       this.setRightDialogVisible=false
    }
     

  }
 
}
</script>

<style lang="less" scoped>
.el-tag{
  margin:7px;
}
.bdtop{
  border-top:1px solid #eee
}

.bdbottom{
  border-bottom:1px solid #eee
}
.vcenter{
  display:flex;
  align-items: center;
}
</style>
