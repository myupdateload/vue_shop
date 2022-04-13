<template>
    <el-container class="home_con">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button  type="info" @click="logout">退出</el-button></el-header>
    <el-container>
        <!-- 侧边区域 -->
        <el-aside :width="iscoll?'64px':'200px'">
            <div class="tangle_btn" @click="tangle">|||</div>
            <!-- 菜单栏 -->
        <el-menu  :collapse="iscoll" router :collapse-transition="false"  background-color="#333744" text-color="#fff" active-text-color="#ffd04b" unique-opened>
        <!-- 一级菜单 -->
        <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item  :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id">{{subitem.authName}}</el-menu-item>
        </el-submenu>
        </el-menu>
    </el-aside>
        <!-- 有侧主体区域 -->
        <el-main><router-view></router-view></el-main>
    </el-container>
    </el-container>
</template>
<script>

export default {
    data(){
        return{
        menulist:[],
        iscoll:false
    }
        
    },
    created(){
        this.getMenuList()
    },
    methods:{
        async getMenuList(){
            const {data:res}=await this.$http.get('menus')
            if(res.meta.status!==200) return this.$message.error(res.meta.msg);
            this.menulist=res.data
           
        },
        tangle(){
            this.iscoll=!this.iscoll
        },
        logout(){
           window.sessionStorage.clear()
           this.$router.push("/login")
       }
   }
}
</script>

<style lang="less" scoped>
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #eee;
}
.el-aside{
    background-color: #333744;
}
.el-menu{
    border-right: none;
}
.el-main{
    background-color: #eaedf1;
}
.home_con{
    height: 100%;
}
img{
    height: 30px;
    width: 30px;
}
.tangle_btn{
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color:#fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>