<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片试图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-input placeholder="请输入内容">
                        <el-button slot="append"  icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </el-card>

        <!-- 订单列表数据区域 -->
        <el-table :data="orderlist" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="订单编号" prop="order_number"></el-table-column>
            <el-table-column label="订单价格" prop="order_price"></el-table-column>
            <el-table-column label="是否付款" prop="pay_status">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.pay_status===1">已付款</el-tag>
                    <el-tag type="danger" v-else>未付款</el-tag>
                </template> 
            </el-table-column>
            <el-table-column label="是否发货" prop="is_send">
            </el-table-column>
            <el-table-column label="下单时间" prop="create_time">
                <template slot-scope="scope">
                    {{scope.row.create_time|dateFormat}}
                </template>
            </el-table-column>
            <!-- <el-table-column>
                <template>
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="showbox"></el-button> 
                    <el-button type="success" size="mini" icon="el-icon-location" @click="showprogress"></el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <!-- 分页区 -->
        <span class="demonstration">完整功能</span>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[5,0,15]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 修改地址对话框 -->
    <el-dialog
        title="修改地址"
        :visible.sync="adVisible"
        width="50%">
        <el-form :model="adform" :rules="adrules"  label-width="100px" >
            <el-form-item label="省市区、县" prop="ad1">
                 <el-cascader :options="citydata" ></el-cascader>
            </el-form-item>

            <el-form-item label="详细地址" prop="ad2">
               
            </el-form-item>
         </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="adVisible = false">取 消</el-button>
            <el-button type="primary" @click="adVisible = false">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 展示物流信息
    <el-dialog
    title="物流进度"
    :visible.sync="progressVisible"
    width="50%">
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
        <el-button @click="progressVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressVisible = false">确 定</el-button>
    </span>
    </el-dialog> -->


    </div>
</template>

<script>
import city from './city.js'
export default {
    data(){
        return{
            queryinfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            progressVisible:false,
            total:0,
            orderlist:[],
            adVisible:false,
            adform:{
                ad1:[],
                ad2:'',
            },
            adrules:{
                ad1:{required:true,message:'请选择省市、县',trigger:'blur'},
                ad2:{required:true,message:'请输入详细地址',trigger:'blur'}
            },
            citydata:city.provice,
            progressinfo:[]

        }
    },
    created(){
        this.getorderlist()
    },
    methods:{
        async showprogress(){
            // const{data:res} = await this.$http.get('/kuaidi/804909574412544580')
            // this.progressVisible=true
            // if(res.meta.status!==200){
            //     return this.$message.error('获得地址信息失败')
            // }
            // this.progressinfo=res.data
          
        },
        showbox(){
            this.adVisible=true
        },
        handleCurrentChange(newpage){
            this.queryinfo.pagenum=newpage
            this.getorderlist()
        },
        handleSizeChange(newsize){
            this.queryinfo.pagesize=newsize
            this.getorderlist()
        },
         async getorderlist(){
            console.log(this.citydata);
            const{ data : res } = await this.$http.get('orders',{params:this.queryinfo})
            if(res.meta.status!==200){
                return this.$message.error('获得订单列表失败')
            }
            this.total=res.data.total
            this.orderlist=res.data.goods
        }
    }

}
</script>

<style lang="less" scoped>

</style>