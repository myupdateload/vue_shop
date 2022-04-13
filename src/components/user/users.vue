<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        
        <!-- 卡片视图 -->
        <el-card >
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="userinfo.query" clearable  class="input-with-select">
                    <el-button slot="append" @click="getuserlist"  icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="opendialog">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userlist" border stripe>
                <el-table-column label="#"    type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" prop="mg_state">
                    <template slot-scope="scope">
                        <el-switch @change="userstatechange(scope.row)"
                        v-model="scope.row.mg_state">
                        </el-switch>
                    </template>
                </el-table-column>
                <!-- 操作区域 -->
                <el-table-column label="操作" width="190px" >
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showdialog(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" @click="removeuserid(scope.row.id)" icon="el-icon-delete" size="mini"></el-button>
                        <!-- 分配按钮 -->
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
                            <el-button @click="setrole(scope.row)" type="warning" icon="el-icon-setting" size="mini"></el-button>
                            </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination 
            @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="userinfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="userinfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                    </el-pagination>
        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog @close="elclose" title="添加用户" :visible.sync="dialogVisible" width="30%" >
            <!-- 内容主题区域 -->
           <el-form :model="addform" :rules="addformrules" ref="addformrule" label-width="70px" >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addform.username"></el-input>
                </el-form-item>
           </el-form>

            <el-form :model="addform" :rules="addformrules" ref="addformrule" label-width="70px" >
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addform.password"></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addform.email"></el-input>
                </el-form-item>

                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addform.mobile"></el-input>
                </el-form-item>
           </el-form>

            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="adduser">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog
            title="修改用户" @close="closeedit" 
            :visible.sync="editdialog"
            width="50%">
            <el-form ref="editformref" :model="editform" :rules="addformrules" label-width="70px">
                <el-form-item label="用户名" >
                    <el-input v-model="editform.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="email" prop="email" >
                    <el-input v-model="editform.email" ></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editform.mobile" ></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editdialog = false">取 消</el-button>
                <el-button type="primary" @click="edituserinfo">确 定</el-button>
            </span>

        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog
            title="提示"
            :visible.sync="setroledialogvisible"
            width="30%">
            <div>
                <p>当前用户：{{userinfos.username}}</p>
                <p>当前角色：{{userinfos.role_name}}</p>
                <p>分配新角色：
                    <el-select v-model="selectroleid" placeholder="请选择">
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
    <el-button @click="setroledialogvisible = false">取 消</el-button>
    <el-button type="primary" @click="saveroleinfo">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        var checkemail = (rule , value , cb) =>{
        const regemail=  /^([\w\.\-]+)\@(\w+)(\.([\w^\_]+)){1,2}$/;
        if(regemail.test(value)){return cb()}
        cb(new Error('请输入合法邮箱'))
        }

        var checkmobile = (rule , value , cb) =>{
        const regmobile=  /^0{0,1}(13[4-9]|15[7-9]|15[0-2]|18[7-8])[0-9]{8}$/;
        if(regmobile.test(value)){return cb()}
        cb(new Error('请输入合法手机号'))

        }
        

        return{
            userinfo:{
                query:'',
                pagenum:1,
                pagesize:2
            },
            editdialog:false,
            userlist:[],
            total:0,
            editform:{},
            setroledialogvisible:false,
            dialogVisible:false,
            userinfos:{},
            rolelist:{},
            selectroleid:'',
            addform:{
                username:'',
                password:'',
                eamil:'',
                mobile:''
            },
            addformrules:{
                username:[{
                    required:true,
                    message:'请输入用户名',
                    trigger:'blur' 
                },
                {
                    min:3,
                    max:10,
                    message:'用户名长度3-10',
                    trigger:'blur' 
                }

                ],

                password:[{
                    required:true,
                    message:'请输入密码',
                    trigger:'blur' 
                },
                {
                    min:3,
                    max:10,
                    message:'用户名长度3-10',
                    trigger:'blur' 
                }

                ],
                
                email:[{
                    required:true,
                    message:'请输入邮箱',
                    trigger:'blur' 
                },
                {
                    validator:checkemail,trigger:'blur'
                }

                ],
                mobile:[{
                    required:true,
                    message:'请输入手机号',
                    trigger:'blur' 
                },
                {
                    validator:checkmobile,trigger:'blur'
                }

                ]

            }
        }
    },
    created(){
        this.getuserlist()
    },
    methods:{
        async removeuserid(id){
            const confirmresult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=>{
                return err
            }
            )
            if(confirmresult!=='confirm'){return this.$message.info('已取消删除')}
            const{data:res}= await this.$http.delete('users/'+id)
            if(res.meta.status!==200) {
            return this.$message.error('删除用户失败')
            }
            this.$message.success('删除用户成功')
            this.getuserlist()
        },
        edituserinfo(){
            this.$refs.editformref.validate(async valid=>{
                if(!valid) return
                const {data:res}= await this.$http.put('users/'+this.editform.id,{
                    email:this.editform.email,
                    mobile:this.editform.mobile
            })
            if(res.meta.status !== 200){
                return this.$message.error('更新用户失败')
                }
                this.editdialog=false
                this.getuserlist()
                this.$message.success('更新用户成功')
            })
        },

        adduser(){
            this.$refs.addformrule.validate(async valid=>{
                if(!valid) return
                const {data:res} = await this.$http.post('users',this.addform)
                if(res.meta.status !== 201) return this.$message.error('添加用户失败')
                this.$message.success('添加用户成功')
                this.dialogVisible = false
                this.getuserlist()
            })  
        },
        elclose(){
            this.$refs.addformrule.resetFields()
        },
        opendialog(){
            this.dialogVisible=true
        },
        async getuserlist(){
            const {data:res} = await this.$http.get('users',{params:this.userinfo})
            if(res.meta.status !== 200) return this.$messsage.error('获取用户列表失败');
            this.total=res.data.total
            this.userlist=res.data.users
        },
        handleSizeChange(newSize){
            this.userinfo.pagesize=newSize,
            this.getuserlist()
        },
        //监听页码值改变
        handleCurrentChange(newPage){
            this.userinfo.pagenum=newPage,
            this.getuserlist()
        },
        async userstatechange(userinfo){
            const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if(res.meta.status !== 200){
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error('更新用户状态失败');
                
            }
            this.$message.success('更新成功')
        },
        async showdialog(id){
            this.editdialog=true
            const {data:res}=await this.$http.get('users/'+id)
            if(res.meta.status !== 200){
                return this.$message.error('查询用户状态失败');
            }
            this.editform=res.data
            this.editdialog=true
        },
        closeedit(){
            this.$refs.editformref.resetFields()
            // this.editdialog=false
        },

        async setrole(userinfos){
            this.userinfos=userinfos
            const{data:res}=await this.$http.get('roles')
            if(res.meta.status !== 200){
                return this.$message.error('获取角色列表失败');
            }
            this.rolelist=res.data
            this.setroledialogvisible=true
        },
        async saveroleinfo(){
            if(!this.selectroleid){
                return this.$message.error('请选择用户的角色');
            }
            const {data:res} = await this.$http.put(`users/${this.userinfos.id}/role`,{rid:this.selectroleid})
            if(res.meta.status!==200){ 
                return this.$message.error('更新角色失败')
            }
            this.$message.success('更新角色成功')
            this.getuserlist()
            this.setroledialogvisible=false
        }



        }
        
    
    

}
</script>
<style lang="less" scoped>

</style>