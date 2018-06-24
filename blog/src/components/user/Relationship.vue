<template>
    <div class="relationship">
        <ul v-for="(people, index) in arr" :key="index">
            <li v-if="index == 0">关注我的</li>
            <li v-else>我的关注</li>
            <li v-for="(obj, cur) in people" :key="cur">
                <p>
                    <img :src="api + obj.image" class="portrait">
                    <span>{{obj.name}}</span>
                    <button v-if="index == 1" class="focus">{{status}}</button>
                </p>
            </li>
        </ul>    
    </div>
</template>

<script>
export default {
    name: 'relationship',
    props: ['arr', 'api'],
    data() {
        return {
            status: '已关注'
        };
    }
}
</script>

<style scoped>

.relationship {
    position: relative;
    background-color: white;
}
.relationship p{
    white-space: nowrap;
    line-height: 50px;
    padding:0;
    padding: 20px;
    border: 1px solid #f7f8fa;
}
.relationship img { vertical-align: middle;}
.relationship span { font-size: 2em;}
.focus {
    color: white;
    font-size: 0.8em;
    padding: 9px 25px;
    border-radius: 5px;
    margin-left: 450px;
    background-color: #92c452;
}
.focus:hover { background-color: #a7cf74;}
.focus:active { background-color: #92c452;}
.portrait{
    height:4em ;
    width:4em;
    border-radius: 2em;
    margin:0 30px;
    vertical-align: super;
}
</style>