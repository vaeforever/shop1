<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span='8'>
          <el-input placeholder="请输入内容"  v-model='queryinfo.query' clearable>
            <el-button slot="append" icon="el-icon-search" @click='getGoodsList'></el-button>
          </el-input>

        </el-col>
        <el-col :span='4'>
          <el-button type='primary' @click='goAddpage'>添加商品</el-button>
        </el-col>
      </el-row>
       
       <el-table :data='goodslist' border stripe>
           <el-table-column type='index'></el-table-column>
           <el-table-column label='商品名称' prop='goods_name' ></el-table-column>
          <el-table-column label='商品价格' prop='goods_price' width='95px'></el-table-column>
            <el-table-column label='商品重量' prop='goods_weight' width='70px'></el-table-column>
            <el-table-column label='创建时间' prop='add_time' width='140px'>
              <template slot-scope='scope'>
                {{scope.row.add_time | dateFormat}}
              </template>
            </el-table-column>
            <el-table-column label='操作'>
              <template slot-scope='scope'>
                <el-button type='primary' icon='el-icon-edit' size='mini'></el-button>
                <el-button type='danger' icon='el-icon-delete' size='mini' @click='removeById(scope.row.goods_id)'></el-button>

              </template>
            </el-table-column>
       </el-table>
         <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryinfo.pagenum"
          :page-sizes="[1,5,10,20]"
          :page-size='queryinfo.pagesize'
          layout="prev, pager, next, jumper"
           :total="total" background>
         </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return{
      queryinfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      goodslist:[],
      total:0
    }
  },
  created(){
    this.getGoodsList()
  },
  methods:{
    async getGoodsList(){
      const {data:res} = await this.$http.get('goods',{params: this.queryinfo})
      if(res.meta.status!==200){
        return this.$message.error('获取失败')
      }
       this.$message.success('获取成功')
       console.log(res.data)
       this.goodslist=res.data.goods
       this.total=res.data.total
     
    },
    handleSizeChange(newsize){
      this.queryinfo.pagesize=newsize
      this.getGoodsList()
    },
    handleCurrentChange(newnum){
      this.queryinfo.pagenum=newnum
      this.getGoodsList()
    },
    async removeById(id){
      const confirmResult = await 
      this.$confirm(
        '此操作将永久删除该商品，是否继续',
        '提示',
        {
          confirmResult:'确定',
          cancelButtonText:'取消',
          type:'waring'
        }).catch(err => err)

         if(confirmResult !=='confirm'){
          return this.$message.error('已经取消删除')
        }

        
      
     
      const {data:res} =await this.$http.delete(`goods/${id}`)
      if(res.meta.status!==200){
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getGoodsList()

    },
    goAddpage(){
      this.$router.push('/goods/add')
    }
  }

}
</script>

<style lang="less" scoped>

</style>