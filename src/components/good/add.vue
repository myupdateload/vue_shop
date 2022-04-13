<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片试图 -->
        <el-card>
            <el-alert title="添加商品信息" type="info" :closable="false" center show-icon>
            </el-alert>
                <el-steps :space="300" :active="activeindex-0" finish-status="success" align-center>
                    <el-step title="基本信息"></el-step>
                    <el-step title="商品参数"></el-step>
                    <el-step title="商品属性"></el-step>
                    <el-step title="商品图片"></el-step>
                    <el-step title="商品内容"></el-step>
                    <el-step title="完成"></el-step>
                </el-steps>

        <!-- tab栏 -->
        <el-form :model="addform" :rules="addformrules" ref="adruleform" label-width="100px" label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeindex" :before-leave="beforetableave" @tab-click="tabclick">
            <el-tab-pane label="基本信息" name="0">
                <el-form-item label="商品名称" prop="goods_name">
                    <el-input v-model="addform.goods_name"></el-input>
                </el-form-item>
                 <el-form-item label="商品价格" prop="goods_price" type="number">
                    <el-input v-model="addform.goods_price"></el-input>
                </el-form-item>
                 <el-form-item label="商品重量" prop="goods_weight">
                    <el-input v-model="addform.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                    <el-input v-model="addform.goods_number" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类" prop="goods_cat">
                    <el-cascader v-model="addform.goods_cat" expand-trigger="hover" :options="catelist"
                    :props="cateprops" @change="handleChange">
                    </el-cascader>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
                <el-form-item :label="item.attr_name" prop="goods_number" v-for="item in manytabdata" :key="item.attr_id">
                    <el-checkbox-group v-model="item.attr_vals">
                        <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2" >
                <el-form-item :label="item.attr_name" v-for="item in onlytabdata" :key="item.attr_id">
                     <el-input v-model="item.attr_vals" :label="item.attr_name"></el-input>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
                <el-upload :on-success="headsuccess"
                    action="https://lianghj.top:8888/api/private/v1/upload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove" :headers="headerobj"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-tab-pane>
            <!-- 尚未开发来自商品列表开发30 -->
            <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
        </el-form>
        </el-card>

        <!-- 图片预览 -->
        <el-dialog title="提示" :visible.sync="preVisible" width="50%">
            <img :src="prepath" alt="" class="preimg">
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
        manytabdata:[],
        preVisible:false,
        onlytabdata:[],
        activeindex:'0',
        prepath:'',
        headerobj:{
            Authorization:
            window.sessionStorage.getItem('token')
        },
        catelist:[],
        cateprops:{
            label:'cat_name',
            value:'cat_id',
            children:'children'
        },
        addform:{
            goods_name:'',
            goods_price:0,
            goods_number:0,
            goods_weight:0,
            goods_cat:[],
            pics:[]
        },
        addformrules:{
            goods_name:[{required:true,message:'请输入商品名称',trigger:'blur'}],
            goods_price:[{required:true,message:'请输入商品价格',trigger:'blur'}],
            goods_number:[{required:true,message:'请输入商品数量',trigger:'blur'}],
            goods_weight:[{required:true,message:'请输入商品重量',trigger:'blur'}],
            goods_cat:[{required:true,message:'请输入商品重量',trigger:'blur'}]
        }
        }
    },

    created(){
        this.getcatelist()
    },

    methods:{
        headsuccess(response){
            const picinfo={pic:response.data.tmp_path}
            this.addform.pics.push(picinfo)
        },
        //移除图片
        handleRemove(file){
            const filepath=file.response.data.tmp_path
            const i= this.addform.pics.findIndex(x=>x.pic===filepath)
            this.addform.pics.splice(i,1)
        },
        handlePreview(file){
            this.prepath=file.response.data.url
            this.preVisible=true
        },
        async tabclick(){
            if(this.activeindex==='1'){
                const{data:res} = await this.$http.get(`categories/${this.cateid}/attributes`,{params:{sel:'many'}})
                if(res.meta.status!==200){
                return this.$message.error('获取失败')
                }
                res.data.forEach(item => {
                    item.attr_vals=
                    item.attr_vals.length===0?[]:item.attr_vals.split('')     
                });
                this.manytabdata=res.data
            }else if(this.activeindex==='2'){
                const{data:res} = await this.$http.get(`categories/${this.cateid}/attributes`,{params:{sel:'only'}})
                 if(res.meta.status!==200){
                return this.$message.error('获取静态列表失败')
                }
                this.onlytabdata=res.data
            }
        },
        beforetableave(actiename,oldactivename){
            if(oldactivename==='0'&&this.addform.goods_cat.length!==3){
                this.$message.error('请先选择分类')
                return false
            }
        },
        handleChange(){
            if(this.addform.goods_cat.length!==3){
                this.addform.goods_cat=[]
            }
        },
        async getcatelist(){
            const{data:res}=await this.$http.get('categories')
            if(res.meta.status!==200){
                return this.$message.error('获取失败')
            }
            this.catelist=res.data
        }
    },

    computed:{
        cateid(){
            if(this.addform.goods_cat.length===3){
                return this.addform.goods_cat[2]
            }
            return null
        }
    }
}
</script>

<style lang="less" scoped>
    .el-checkbox{
        margin: 0 5px 0 0 !important;
    }
    .preimg{
        width: 100%;
    }
</style>