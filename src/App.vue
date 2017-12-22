<template>
    <div id="app">
        <h1>{{title}}</h1>
        <div class="top-img" ><img src="./assets/top.jpg" alt=""></div>
        <ul class="todos">
            <li>
                <input v-model="newTodo"
                       @keyup.13="addItem"
                       placeholder="快写下您要我记住的事吧"
                       autofocus="true"/>
            </li>
            <li v-for="(todo,index) in todos"
                :class="{'checked':todo.done}">
                <input type="checkbox"
                       @change="updateItem(todo)"
                       v-model="todo.done"
                />
                <label style="width: 200px;" @click.prevent="updateItem(todo)">{{ index+1 }}.{{ todo.value }}</label>
                <time class="finished" v-if="todo.done==true">完成于：{{ todo.finished | date }}</time>
                <time>{{ todo.created | date }}</time>
                <button @click.prevent="delItem(todo)"></button>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    import './assets/site.less'
    import './assets/todos.less'
    import moment from 'moment'
    import 'moment/locale/zh-cn'
    moment.locale('zh-cn')
    //使用axios配置文件
    import axios from 'axios'
    import config,{baseurl} from '../config/axios_config'
    export default {
        name: 'app',
        data () {
            return {
                newTodo:'',
                title: '备忘记事',
                todos: []
            }
        },
        created (){
            this.getList();
        },
        filters: {
            date(val){
                //不知道为何转换出来的时间比数据库的时间多了14小时，所以这里做减法
                // return moment(val).subtract(14,'hours').format('MMM Do a h:mm:ss')
                return moment(val).subtract(14,'hours').startOf('minite').fromNow();
            }
        },
        methods: {
            getList() {
                // GET /someUrl
                axios.get(`${baseurl}/task/list.html`).then(response => {
                    var json = JSON.parse(response.data.result);
                    console.log(json)
                    var len = json.resultList.length;
                    this.todos = [];
                    for(var i=0;i<len;i++)
                    {
                        this.todos.push({
                            id: json.resultList[i].id,
                            value: json.resultList[i].taskName,
                            finished: json.resultList[i].finishedDate,
                            created: json.resultList[i].createDate,
                            done: json.resultList[i].delFlag==1
                            });
                    }
                }, response => {
                    console.log("error");
                });
            },
            addItem() {                
                //开始保存数据到数据库
                axios.post(`${baseurl}/task/addTask.html`,
                    {
                        taskName: this.newTodo,
                        // createDate: formatDate(new Date(),"yyyy-MM-dd HH:mm:ss"),
                        delFlag: '0',
                        userId: '001'
                    },config)
                    .then(response =>{
                        console.log(response.data);
                        //获取请求后刷新页面
                        this.getList();
                    }).catch(function(err){
                        console.log(err);
                })
                this.newTodo = ''
            },
            delItem (todo) {
                this.todos = this.todos.filter((x) => x !== todo)
                console.log(todo.id)
                //同时删除数据库数据
                axios.post(`${baseurl}/task/delete.html`,
                {
                    taskId: todo.id
                },config).then(response=>{
                    console.log(response.data)
                    //获取请求后刷新页面
                    this.getList();
                }).catch(response=>{
                    console.log('error')
                })
            },
            updateItem(todo){
                //更新任务状态
                axios.post(`${baseurl}/task/update.html`,
                {
                    taskId: todo.id,
                    taskStatus: todo.done
                },config).then(response=>{
                    console.log(response.data)
                    //刷新页面
                    this.getList()
                }).catch(response=>{
                    console.log('error')
                })
            }
        }
    }
</script>

<style>
.top-img{
    text-align:center;
}
.top-img img{
    width:100%;
    height:100%;
    background-size:100% 100%;
}
.finished{
    right: 150px !important;
    color:green;
}
</style>
