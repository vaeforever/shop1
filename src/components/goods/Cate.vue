<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type='primary' @click='showaddCateDolag'>添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table class='treetable' :data='catelist' :columns='columns'
      :selection-type='false' :expand-type='false'
      show-index index-text='#' border :show-row-hover='false'>
      <template slot='isok' slot-scope='scope'>
        <i class='el-icon-success' v-if='scope.row.cat_deleted===false' style='color:lightgreen'></i>
        <i class='el-icon-error' v-else style='color:red'></i>
        

      </template>
      <template slot='order' slot-scope='scope' >
        <el-tag v-if='scope.row.cat_level===0' size='mini'>一级</el-tag>
        <el-tag v-else-if='scope.row.cat_level===1' type="success" size='mini'>二级</el-tag>
        <el-tag  type='warning' size='mini' v-else>三级</el-tag>
      </template>

      <template slot='opt' slot-scope='scope'>
        <el-button type='primary' icon='el-icon-edit' size='mini'>编辑</el-button>
        <el-button type='danger' icon='el-icon-delete' size='mini'>删除</el-button>
      </template>
      </tree-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querinfo.pagenum"
      :page-sizes="[1,3,5]"
      :page-size="querinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <el-dialog
  title="添加分类"
  :visible.sync="addCateDialogVisible"
  width="50%"
  @close='addCateDialogClosed'
  >
 <el-form :model="addCateForm" :rules="addCateFormrules" ref="addCateFormRef" label-width="100px" >
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
   
  </el-form-item>
  <el-form-item label='父级分类'>
     <el-cascader
     expand-trigger='hover'
    v-model="selectedKeys"
    :options="parentCateList"
    :props="cascaderProps"
    @change="parentCateChanged" clearable change-on-select=""></el-cascader>
  </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      catelist:[],
      querinfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      total:0,
      columns:[{
        label:'分类名称',
        prop:'cat_name'
      },{
        label:'是否有效',
        type:'template',
        template:'isok'
      },{
        label:'排序',
        type:'template',
        template:'order'
      },{
        label:'操作',
        type:'template',
        template:'opt'
      }
      ],
      addCateDialogVisible: false,
      addCateForm:{
        cat_name:'',
        cat_pid:0,
        cat_level:0
      },
      addCateFormrules:{
        cat_name:[
          {required:true,message:'请输入类名称',trigger:'blur'}
        ]
      },
      parentCateList:[],
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      selectedKeys:[]
      

    }
  },
  created(){
    this.getCateList()

  },
  methods:{
    async getCateList(){
      const {data:res}= await this.$http.get('categories',{params: this.querinfo})
      if(res.meta.status!=200){
        return this.$message.error('获取商品分类失败')
      }
      // console.log(res.data)
      this.catelist=res.data.result
      this.total=res.data.total
    },
    handleSizeChange(newsize){
      this.querinfo.pagesize=newsize
      this.getCateList()

    },
    handleCurrentChange(newnum){
      this.querinfo.pagenum=newnum
      this.getCateList()
    },
   
    showaddCateDolag(){
      this.getParentCatteList()
      this.addCateDialogVisible=true;
    },
    async getParentCatteList(){
        const {data:res}=await this.$http.get('categories',{params:{type:2}})
        if(res.meta.status!==200){
          return this.$message.error('获取父级分类数据失败')
        }
        // console.log(res.data)
        this.parentCateList=res.data
        // console.log(this.parentCateList)

      },
      parentCateChanged(){
        console.log(this.selectedKeys)
        if(this.selectedKeys.length>0){
          this.addCateForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1]
          this.addCateForm.cat_level=this.selectedKeys.length
          return
        }else{
          this.addCateForm.cat_pid=0;
           this.addCateForm.cat_level=0
        }
      },
       addCate(){
       this.$refs.addCateFormRef.validate(async valid=> {
         if(!valid) return
         const {data:res}= await this.$http.post('categories',this.addCateForm)
         if(res.meta.status!==201){
           return this.$message.error('添加失败')
         }
         this.$message.success('添加成功')
         this.getCateList()
         this.addCateDialogVisible=false
       })
      },
      addCateDialogClosed(){
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys=[]
        this.addCateForm.cat_level=0
        this.addCateForm.cat_pid=0
      }



  }
  
}
</script>

<style lang="less" scoped>
.treetable{
  margin-top:15px;
}

</style>