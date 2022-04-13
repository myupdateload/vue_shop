<template>
    <div>
         <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片试图 -->
        <el-card>
            <el-alert
                title="注意:只允许为第三级分类设置相关的参数!"
                type="warning" :closable="false" show-icon>
            </el-alert>
            <el-row class="cat_opt">
                <el-col>
                    <el-cascader
                v-model="selectkeys" expand-trigger="hover"
                :options="catelist"
                :props="cateprops"
                @change="handleChange"></el-cascader>
                </el-col>
            </el-row>
            <!-- tab区域 -->
            <el-tabs  v-model="activename" @tab-click="handleclick">
                <!-- 添加动态参数面板 -->
            <el-tab-pane label="动态参数" name="many">
                <el-button size="mini" type="primary" :disabled="isbtn" @click="addVisible=true">添加动态</el-button>
                <el-table :data="manytabledata" border stripe>
                    <el-table-column type="expand"></el-table-column>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作" >
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showeditdialog(scope.row.attr_id)">修改</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
                <el-button size="mini" type="primary" :disabled="isbtn"  @click="addVisible=true">添加属性</el-button>
                <el-table :data="onlytabledata" border stripe>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作" >
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showeditdialog(scope.row.attr_id)">修改</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>

        </el-card>

        <!-- 添加参数对话框 -->
         <el-dialog
            :title="'添加'+titletext"
            :visible.sync="addVisible"
            width="50%"
            @close="dialogclose"
            >
            <el-form ref="formref"  :model="addform" label-width="80px" :rules="addformrules">
                <el-form-item :label="titletext " prop="attr_name">
                    <el-input v-model="addform.attr_name"></el-input>
                </el-form-item>
                
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addparams">确 定</el-button>
            </span>
            </el-dialog>
        <!-- 修改参数对话框 -->
        <el-dialog
            @close="editdialogclose"
            :title="'修改'+titletext"
            :visible.sync="editdialogVisible"
            width="50%">
            <el-form ref="editformref"  :model="editform" label-width="80px" :rules="editformrules">
                <el-form-item :label="titletext " prop="attr_name">
                    <el-input v-model="editform.attr_name"></el-input>
                </el-form-item>
                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editparams">确 定</el-button>
        </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data(){
        return{
        catelist:[],
        selectkeys:[],
        activename:'many',
        manytabledata:[],
        onlytabledata:[],
        addVisible:false,
        editdialogVisible:false,
        editform:{},
        editformrules:{
             attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'}]
        },
        addform:{
            attr_name:''
        },
        addformrules:{
            attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'}]
        },

        cateprops:{
            value:'cat_id',
            label:'cat_name',
            children:'children'
        },
        }
    },
    created(){
        this.getcatelist()
    },
    methods:{
            async editparams(){
                const{data:res} = await this.$http.put(`categories/${this.cateid}/attributes/${this.editform.attr_id}`,{attr_name:this.editform.attr_name, attr_sel:this.activename})
                if(res.meta.status!==200){
                
                return this.$message.error('修改失败')}
                this.$message.success('修改成功')
                this.editdialogVisible=false
                this.getparamsdata()
            },
            editdialogclose(){
                this.$refs.editformref.resetFields()
            },
            async showeditdialog(attr_id){
                this.editdialogVisible=true
                const{data:res} = await this.$http.get(`categories/${this.cateid}/attributes/${attr_id}`,{params:{attr_sel:this.activename}})
                if(res.meta.status!==200){
                
                return this.$message.error('获取失败')
                }
                this.editform=res.data
            },
            addparams(){
            this.$refs.formref.validate(async valid=>{
                if(!valid) return
                const{data:res} = await this.$http.post(`categories/${this.cateid}/attributes`,{attr_name:this.addform.attr_name,attr_sel:this.activename})
                if(res.meta.status!==201){
                
                return this.$message.error('添加失败')
                }
                this.$message.success('添加成功')
                this.addVisible=false
                this.getparamsdata()
            })
        },
        dialogclose(){
            this.$refs.formref.resetFields()
        },
        handleclick(){
            this.getparamsdata()
        },
        async handleChange(){
            this.getparamsdata()
        },
        async getparamsdata(){
            if(this.selectkeys.length!==3){
                this.selectkeys=[]
                return
            }
            const {data:res} = await this.$http.get(`categories/${this.cateid}/attributes`,{params:{sel:this.activename}})
            
            if(res.meta.status!==200){
               
                return this.$message.error('获得参数失败')
            }
            if(this.activename==='many'){
                this.manytabledata=res.data
            }else{
                this.onlytabledata=res.data
            }
        },
        async getcatelist(){
            const {data:res }=await this.$http.get('categories')
            if(res.meta.status!==200){
                return this.$message.error('获得商品分类失败')
            }
            this.catelist=res.data
            }
        },
        computed:{
            isbtn(){
                if(this.selectkeys.length!==3){
                    return true
                }
                return false
            },
            cateid(){
                if(this.selectkeys.length===3){
                    return this.selectkeys[2]
                }
                return null
            },
            titletext(){
                if(this.activename==='many'){
                    return '动态参数'
                }
                return '静态属性'
            }

        }
        
}
</script>

<style lang="less" scoped>
.cat_opt{
    margin: 15px 0;
}
</style>