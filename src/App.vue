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
                /><label>{{ index+1 }}.{{ todo.value }}</label>
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
            if (this.is_initialized) {
                this.todos = JSON.parse(localStorage.getItem('VUE-TODOS'))
            }
        },
        computed: {
            is_initialized (){
                return localStorage.getItem('VUE-TODOS') != null
            }
        },
        filters: {
            date(val){
                return moment(val).calendar()
            }
        },
        mounted: function () {
        // GET /someUrl
            this.$http.get('http://localhost:9999/task/list').then(response => {
                 var json = JSON.parse(response.data.result);
                 console.log(json)
                 var len = json.resultList.length;
                 this.todos = [];
                 for(var i=0;i<len;i++)
                 {
                     this.todos.push({value:json.resultList[i].taskName,created:json.resultList[i].createDate,done:json.resultList[i].delFlag==1});
                 }
            }, response => {
                console.log("error");
            });
        },
        methods: {
            addItem() {
                this.todos.push({
                    value: this.newTodo,
                    created: Date.now(),
                    done: false
                });
                //开始保存数据到数据库
                this.$http.post('http://localhost:9999/task/addTask',
                    {   
                        taskName: this.newTodo,
                        createDate: Date.now(),
                        delFlag: '0',
                        userId: '001'
                    }).then(response=>
                    {
                        console.log(response.data)
                    })
                    .catch(response=>
                    {
                        console.log('error')
                    }
                )
                // this.saveToStore();
                this.newTodo = ''
            },
            delItem (todo) {
                this.todos = this.todos.filter((x) => x !== todo)
                this.saveToStore()
            },
            saveToStore(){
                // localStorage.setItem('VUE-TODOS', JSON.stringify(this.todos))
            }
        }
    }
</script>