<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片试图 -->
        <!-- <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>
        </el-card> -->

        <!-- 角色列表区域 -->
        <el-table :data="roleslist" border stripe>
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row :class="['dbbottom',i1===0?'dbtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                        <!-- 一级权限 -->
                        <el-col :span="5">
                            <el-tag closable @close="removerightbyid(scope.row,item1.id)">{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 二级权限 -->
                        <!-- 三级权限 -->
                        <el-col :span="19">
                            <el-row :class="[i2===0?'':'dbtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                <el-col :span="6">
                                    <el-tag closable @close="removerightbyid(scope.row,item2.id)" type="sccess">{{item2.authName}}</el-tag>
                                     <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="18" >
                                   <el-tag @close="removerightbyid(scope.row,item3.id)" type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" closable>{{item3.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    
                </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="typeedit(scope.row.id)">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="typedelete(scope.row.id)">删除</el-button>
                        <el-button type="warning" size="mini" icon="el-icon-setting" @click="showrightdialog(scope.row)" @close="arrclear">分配权限</el-button>
                </template>
            </el-table-column>

        </el-table>

        <!-- 分配权限对话框 -->
        <el-dialog
        title="提示"
        :visible.sync="setrightdialogvisible"
        width="50%">
       <el-tree :data="rightlist" ref="treeref" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defkeys"></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotrights">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 编辑对话框 -->
        <el-dialog
        title="编辑信息 "
        :visible.sync="editdialogVisible"
        width="50%">
        <el-form :model="roleslist"   label-width="70px" >
                <el-form-item label="角色名称" >
                    <el-input v-model="roleslist.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" >
                    <el-input v-model="roleslist.roleDesc"></el-input>
                </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editsubmit">确 定</el-button>
        </span>
        </el-dialog>


    </div>
</template>

<script>
export default {
    data(){
        return{
            roleslist:[],
            setrightdialogvisible:false,
            rightlist:[],
            treelist:[],
            defkeys:[],
            roleid:'',
            editdialogVisible:false,
            treeProps:{
                label:'authName',
                children:'children'
            }
    }
    },
    created(){
        this.getroleslist()
    },
    methods:{
        async editsubmit(){
            
            const {data:res}=await this.$http.put('roles/'+this.roleslist.roleId,this.roleslist)
            if(res.meta.status!==200) {
                
                return this.$message.error('修改失败')
                }
            this.$message.success('提交成功')
            this.editdialogVisible=false
        },
        async typedelete(id){
          const result= await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>{
                return  err})
            if(result!=='confirm'){return this.$message.info('已取消删除')}    
            const {data:res}=await this.$http.delete('roles/'+id)
            if(res.meta.status!==200){ 
                
                return this.$message.error('删除失败')
                }
            this.roleslist=res.data
            
            this.$message.success('删除成功')
            this.getroleslist()
        },
        async typeedit(id){
            const {data:res}=await this.$http.get('roles/'+id)
            if(res.meta.status!==200) {
                
                return this.$message.error('获取失败')
                }
            this.roleslist=res.data
            this.editdialogVisible=true
        },
        async getroleslist(){
            const {data:res}=await this.$http.get('roles')
            if(res.meta.status!==200) return this.$message.error('获取失败')
            this.roleslist=res.data
        },
        async removerightbyid(role,rightid){
            const confirmresult=await
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(err=>err)
            if(confirmresult!=='confirm'){
                return this.$message.info('取消了删除')
            }
            const{data:res}= await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
            if(res.meta.status!==200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            role.children=res.data
        },
        async showrightdialog(role){
            this.roleid=role.id
            const {data:res}=await this.$http.get('rights/tree')
            if(res.meta.status!==200) return this.$message.error('获取权限数据失败')
            this.rightlist=res.data
            this.setrightdialogvisible=true
            this.getleafkeys(role,this.defkeys)
        },

        getleafkeys(node,arr){
            //判定是否为三级节点
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item => 
                this.getleafkeys(item,arr)
            );
        },
        arrclear(){
            this.defkeys=[]
        },
        async allotrights(){
            const keys=[
                ...this.$refs.treeref.
                getCheckedKeys(),
                ...this.$refs.treeref.
                getHalfCheckedKeys()
            ]
            const idstr=keys.join(',')
            const{data:res}= await this.$http.post(`roles/${this.roleid}/rights`,{rids:idstr})
            if(res.meta.status!==200) return this.$message.error('分配权限失败')
            this.$message.success('分配权限成功')
            this.getroleslist()
            this.setrightdialogvisible=false
        }

    }

}
</script>

<style lang="less" scoped>
.el-tag{
    margin: 7px;
}
.dbtop{
    border-top: 1px solid #eee;
}
.dbbottom{
    border-bottom: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>