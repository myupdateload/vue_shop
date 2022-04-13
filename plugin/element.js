import Vue from "vue";
import ElementUI, { Message, MessageBox } from "element-ui";

Vue.use(ElementUI)
Vue.prototype.$confirm=MessageBox.confirm
Vue.prototype.$message=Message