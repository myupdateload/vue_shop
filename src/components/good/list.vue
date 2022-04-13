<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片试图 -->
        <el-card >
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @click="goodlist">
                    <el-button slot="append" icon="el-icon-search" @click="goodlist"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goaddpage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- table表格区域 -->
            <el-table :data="goodslist" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格" width="95px"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
                <el-table-column prop="add_time" label="创建时间" width="190px">
                    <template slot-scope="scope">
                        {{scope.row.add_time|dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="opendialog(scope.row.goods_id)" ></el-button>
                        <el-button type="warning" icon="el-icon-delete" size="mini" @click="removebyid(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryinfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryinfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total" background>
                </el-pagination>
        </el-card>
        <!-- 编辑操作对话框 -->
        <el-dialog
        title="编辑信息 "
        :visible.sync="dialogVisible"
        width="50%">
        <el-form :model="formlist"   label-width="70px" >
                <el-form-item label="商品名称" prop="goods_name">
                    <el-input v-model="formlist.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                    <el-input v-model="formlist.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                    <el-input v-model="formlist.goods_weight"></el-input>
                </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
        </span>
        </el-dialog>


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
            total:0,
            goodslist:[],
            dialogVisible:false,
            formlist:[]
        }
    },
    created(){
        this.goodlist()
    },
    methods:{
        async submit(){
            const {data:res} =await this.$http.put('goods/'+this.formlist.goods_id,this.formlist)
            if(res.meta.status!==200){
                
                return this.$message.error('提交失败')   
                
            }
            this.$message.success('提交成功')
            this.dialogVisible=false
            this.goodlist()
        },
        async opendialog(goods_id){
            this.dialogVisible=true
            const {data:res} =await this.$http.get(`goods/${goods_id}`)
            if(res.meta.status!==200){
                return this.$message.error('获取失败')   
            }
            this.formlist=res.data
        },

        goaddpage(){
            this.$router.push('/good/add')
        },
        async removebyid(id){
            const confirmresult=await
            this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(err=>err)
        if(confirmresult!=='confirm'){
            return this.$message.info('已经取消删除')
        }
        const{data:res}=await this.$http.delete(`goods/${id}`)
        if(res.meta.status!==200){
                return this.$message.error('删除失败')   
            }
        this.$message.success('删除成功')
        this.goodlist()
        },
        handleSizeChange(newsize){
            this.queryinfo.pagesize=newsize
            this.goodlist()
        },
        handleCurrentChange(newpage){
            this.queryinfo.pagenum=newpage
            this.goodlist()
        },
        async goodlist(){
            const {data:res} = await this.$http.get('goods',{params:this.queryinfo})
            if(res.meta.status!==200){
                return this.$message.errer('获取列表信息失败')
            }
            this.$message.success('获取商品列表成功')
            this.goodslist=res.data.goods
            this.total=res.data.total
        }
    }
        
}

</script>

<style lang="css" scoped>

</style>