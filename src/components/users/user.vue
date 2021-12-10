<template>
<div>
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  
</el-breadcrumb>
<el-card >
  <el-row :gutter="20">
  <el-col :span="8">
   <el-input placeholder="请输入内容" v-model='queryInfo.query' clearable @clear='getUserlist'>
   
    <el-button slot="append" icon="el-icon-search" @click='getUserlist'></el-button>
  </el-input>
  </el-col>
  <el-col :span="4">
    <el-button type="primary" @click='addDialogVIsisible=true'>添加用户</el-button>
  </el-col>
  
</el-row>

<el-table :data='userlist' border stripe="">
  <el-table-column type='index'></el-table-column>
  <el-table-column label='姓名' prop='username'></el-table-column>
  <el-table-column label='邮箱' prop='email'></el-table-column>
  <el-table-column label='电话' prop='mobile'></el-table-column>
  <el-table-column label='角色' prop='role_name'></el-table-column>
  <el-table-column label='状态' >
    <template slot-scope="scope">
      <el-switch v-model='scope.row.mg_state' @change='userStateChanged(scope.row)'></el-switch>

    </template>
  </el-table-column>
  <el-table-column label='操作'  width='180px'>
    <template slot-scope="scope">
      <el-button type='primary' icon="el-icon-edit" size='mini' @click='showEditDialog(scope.row.id)'></el-button>
      <el-button type='danger' icon="el-icon-delete" size='mini' @click='removeUsersById(scope.row.id)'></el-button>
      <el-tooltip effect="dark" content='分配角色' placement="top" :enterable='false'>
        <el-button type='warning' icon="el-icon-setting" size='mini' @click='setRole(scope.row)'></el-button>
      </el-tooltip>

    </template>
  </el-table-column>
</el-table>

 <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 5]"
      :page-size="queryInfo.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
 
</el-card>
<el-dialog
  title="提示"
  :visible.sync="setRoleDialogVisible"
  width="50%"
  @close='setRoleDialogClosed'
  >
<div>
  <p>当前的用户:{{userinfo.username}}</p>
  <p>当前的角色:{{userinfo.role_name}}</p>
  <p>分配角色：
    <el-select v-model="selectedRoleId" placeholder="请选择">
    <el-option
      v-for="item in rolelist"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>

  </p>
</div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="添加用户"
  :visible.sync="addDialogVIsisible"
  width="50%"
  @close='addDialogClosed'
  >
 <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="电话" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVIsisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="修改用户"
  :visible.sync="editDialogVisible"
  width="50%"
 >
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" @close='editDialogClosed'>
  <el-form-item label="用户名" >
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop='email'>
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
  <el-form-item label="电话" prop='mobile'>
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>
</div>
  
</template>

<script>
export default {
  data(){
    let checkMobile=(rule,value,cb)=>{
      const regMobile=/^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if(regMobile.test(value)){
        return cb()
      }
      cb(new Error('请输入合法的电话'))
    }
    let checkEmail=(rule,value,cb)=>{
      const regEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(regEmail.test(value)){
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    return{
      setRoleDialogVisible:false,
      userinfo:{},
      rolelist:[],
      selectedRoleId:'',

      queryInfo:{
        query: '',
        pagenum:1,
        pagesize:2

      },
      userlist:[],
      total:0,
      addDialogVIsisible:false,
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
    
      },
      addFormRules:{
        username:[
          {required:true,message:'请输入用户名',trigger:'blur'},
          {min:3,max:10,message:'用户名长度再3~10个字',trigger:'blur'}

        ],
         password:[
          {required:true,message:'请输密码',trigger:'blur'},
          {min:6,max:15,message:'密码长度再6~15个字',trigger:'blur'}

        ],
         email:[
          {required:true,message:'请输入邮箱',trigger:'blur'},
         {validator: checkEmail,tigger:'blur'} 

        ],
         mobile:[
          {required:true,message:'请输入电话',trigger:'blur'},
          {validator: checkMobile,tigger:'blur'}
          

        ],
        
      },
      editDialogVisible: false,
      editForm:{},
      editFormRules:{
        email:[
           {required:true,message:'请输入邮箱',trigger:'blur'},
         {validator: checkEmail,tigger:'blur'} 
          
        ],
        mobile:[
           {required:true,message:'请输入电话',trigger:'blur'},
          {validator: checkMobile,tigger:'blur'}
        ]
      }
    }
  },
  created(){
    this.getUserlist()
  },
  methods:{
    async getUserlist(){
      const {data:res}=await this.$http.get('/users',{params:this.queryInfo})
      if(res.meta.status != 200) return this.$message.error('请求出错')
      this.userlist=res.data.users
      this.total=res.data.total
      
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize
      this.getUserlist()
    },
    handleCurrentChange(newPage){
     this.queryInfo.pagenum=newPage
     this.getUserlist()
    },
    async userStateChanged(userinfo){
      const {data:res}=await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if(res.meta.status !==200){
        userinfo.mg_state=!userinfo.mg_state
        return this.$message.error('更新失败')
      }
      return this.$message.success('更新成功')
    },
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    addUser(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return
        const {data: res}=await this.$http.post('users',this.addForm)
        if(res.meta.status!==201){
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addDialogVIsisible=false
        this.getUserlist()

      })
    },
    async showEditDialog(id){
      const {data:res}=await this.$http.get('users/'+id)
      if(res.meta.status!==200){
        return this.$message.error('查询用户失败')
      }
      this.editForm=res.data
      this.editDialogVisible=true
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return
        const {data:res}=await this.$http.put('users/'+ this.editForm.id,{
          email:this.editForm.email,
          mobile: this.editForm.mobile
        })
        if(res.meta.status!==200)
        {
          return this.$message.error('更新失败')
        }
        this.editDialogVisible=false
        this.getUserlist()
        this.$message.success('更新成功')
      })
    },
    async removeUsersById(id){
      const confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult !=='confirm'){
          return this.$message.info('取消了删除')
        }
        const {data:res}= await this.$http.delete('users/' + id)
        if(res.meta.status!==200){
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getUserlist()
    },
    async setRole(userinfo){
      this.userinfo=userinfo
      const {data:res}= await this.$http.get('roles')
      if(res.meta.status!==200){
        return this.$message.error('获取角色列表失败')
      }
      this.rolelist=res.data
      this.setRoleDialogVisible=true


    },
    async saveRoleInfo(){
      if(!this.selectedRoleId){
        return this.$message.error('请分配角色')
      }
      const {data:res}=await this.$http.put(`users/${this.userinfo.id}/role`,{
        rid: this.selectedRoleId
      })
      if(res.meta.status !==200){
        return this.$message.error('更新角色失败')
      }
      this.$message.success('更新角色成功')
      this.getUserlist()
      this.setRoleDialogVisible=false

    },
    setRoleDialogClosed(){
      this.selectedRoleId='',
      this.userinfo=''
    }
  }
 
}
</script>

<style lang="less" scoped>

</style>