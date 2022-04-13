<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        
         <!-- 卡片试图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button @click="showaddcatedialog" type="primary">添加分类</el-button>
                </el-col>
            </el-row>

        <!-- 表格占位 -->
        <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
            <template slot="isok" slot-scope="scope">
                <i v-if="scope.row.cat_delete===false" class="el-icon-success" style="color:red;"></i>
                <i class="el-icon-error" v-else></i>
            </template>

            <!-- 排序 -->
            <template slot="order" slot-scope="scope">
                <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
                <el-tag type="waning" size="mini" v-else>三级</el-tag>
            </template>

            <!-- 操作 -->
            <template slot="opt" slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-edit">删除</el-button>
            </template>
        </tree-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="querinfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="querinfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog @close="addclickcate"
        title="添加分类"
        :visible.sync="addcatedialogVisible"
        width="50%">

            <!-- 添加分类表单 -->
            <el-form ref="addcateformref" :model="addcateform" label-width="100px" :rules="addcateformrules" >
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addcateform.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类" >
                <el-cascader
                v-model="selectkeys"
                expand-trigger="hover"
                :options="parentcatelist"
                :props="cascaderProps"
                @change="addcate" clearable change-on-select></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addcatesubmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import loginVue from '../login.vue'
export default {
    data(){
        return{
            //查询条件
        catelist:[],
        selectkeys:[],
        cascaderProps:{
            value:'cat_id',
            label:'cat_name',
            children:'children'
        },
        querinfo:{
            type:3,
            pagenum:1,
            pagesize:5
        },
        total:0,
        parentcatelist:[],
        addcateform:{
            cat_name:'',
            cat_pid:0,
            cat_level:0
        },
        addcateformrules:{
            cat_name:[
                {required:true,message:'请输入分类名称',trigger:'blur'}
            ]
         
        },
        addcatedialogVisible:false,
        columns:[
            {
                label:'分类名称',
                prop:'cat_name',
            },
            {
                label:'是否有效',
                type:'template',
                template:'isok'
            },
            {
                label:'排序',
                type:'template',
                template:'order'
            },
            {
                label:'操作',
                type:'template',
                template:'opt'
            }
        ]
        }
    },

    created(){
        this.getcatelist()
    },

    methods:{
        addcatesubmit(){
            this.$refs.addcateformref.validate(async valid=>{
                if(!valid) return
                const{data:res} = await this.$http.post('categories',this.addcateform)
                if(res.meta.status!==201){
                return this.$message.error('提交失败')
            }
            this.$message.success('提交成功')
            this.addcatedialogVisible=false
            })
        },
        //监听对话框监听事件
        addcatedialogclose(){
            this.$refs.addcateformref.resetFields()
            this.selectkeys=[]
            this.addcateform.cat_level=0
            this.addcateform.cat_pid=0
        },
        addclickcate(){
        },
        addcate(){
            //如果数组中长度大于0，说明选中父类
            if(this.selectkeys.length>0){
                this.addcateform.cat_pid= this.selectkeys[this.selectkeys.length-1]
            this.addcateform.cat_level=this.selectkeys.length
            return
            }else{
                this.addcateform.cat_pid=0
                this.addcateform.cat_level=0
            }
        },
        cateChange(){
            if(this.selectkeys.length>0){
                this.addcateform= this.selectkeys[this.selectkeys.length-1]
                this.addcateform.cat_level=this.selectkeys.length
                return
            }else{
                this.addcateform.cat_pid=0,
                this.addcateform.cat_level=0
            }
        },
        async getcatelist(){
            const {data:res }=await this.$http.get('categories',{params:this.querinfo})
            if(res.meta.status!==200){
                return this.$message.error('获得商品分类失败')
            }
            this.catelist=res.data.result
            this.total=res.data.total
        },
        handleSizeChange(newsize){
            this.querinfo.pagesize=newsize
            this.getcatelist()
        },
        handleCurrentChange(){
            this.querinfo.pagenum=newpage
            this.catelist()
        },
        showaddcatedialog(){
            this.getparentlist()
            this.addcatedialogVisible=true
        },
        async getparentlist(){
            const{data:res}= await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status!==200){
                return this.$message.error('获得父级分类失败')
            }
            this.parentcatelist=res.data
        }
    }
}
</script>

<style lang="less" scoped>

.treeTable{
    margin-top: 15px;
}

.el-cascader{
    width: 100%;
}
</style>