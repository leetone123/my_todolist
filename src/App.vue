<template>
    <div id="app">
        <h1>{{title}}</h1>
        <div style="text-align:center;"><img src="./assets/top.jpg" alt=""></div>
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
                       @change="saveToStore"
                       v-model="todo.done"
                />
                <label style="display:none">{{todo.id}}</label>
                <label>{{ index+1 }}.{{ todo.value }}</label>
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
    import config from '../config/axios_config'
    //使用日期格式化插件
    import {formatDate} from '../utils/date'
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
                return moment(val).subtract(14,'hours').calendar()
            }
        },
        methods: {
            getList() {
                // GET /someUrl
                this.$http.get('http://localhost:9999/task/list').then(response => {
                    var json = JSON.parse(response.data.result);
                    console.log(json)
                    var len = json.resultList.length;
                    this.todos = [];
                    for(var i=0;i<len;i++)
                    {
                        this.todos.push({id:json.resultList[i].id,value:json.resultList[i].taskName,created:json.resultList[i].createDate,done:json.resultList[i].delFlag==1});
                    }
                }, response => {
                    console.log("error");
                });
            },
            addItem() {                
                //开始保存数据到数据库
                axios.post('addTask.html',
                    {
                        taskName: this.newTodo,
                        // createDate: formatDate(new Date(),"yyyy-MM-dd HH:mm:ss"),
                        delFlag: '0',
                        userId: '001'
                    },
                    config)
                    .then(function(res){
                        console.log(res);
                    })
                    .catch(function(err){
                        console.log(err);
                })
                this.newTodo = ''
                this.todos =''
                this.getList();
            },
            delItem (todo) {
                this.todos = this.todos.filter((x) => x !== todo)
                console.log(todo.id)
                //同时删除数据库数据
                axios.post('delete.html',
                {
                    taskId: todo.id
                },config).then(response=>{
                    console.log(response.data)
                }).catch(response=>{
                    console.log('error')
                })
                this.todos =''
                this.getList();
            }
        }
    }
</script>