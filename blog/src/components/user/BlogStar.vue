<template>
    <div>
        <div v-if="show[index]"  v-for="(part, index) in arr" :key="index">
            <div v-for="(people, cur) in part"
                    :class="{'star-article':index != 0 || people.flag}"
                    :key="cur"
                    @click="goToArticle(people.article_id)"
                    class="article">
                    <span class="type">{{people.type}}</span>
                    <span class="author">{{people.name || author}}</span>
                    <span class="time">
                        {{new Date(parseInt(people.timer)).toLocaleString()}}
                    </span>
                    <p class="title">
                      {{people.title}}
                    </p>
                    <button>
                        <span class="icon icon-color" :class="{'icon-star': (people.flag || index == 1)}" title="收藏" @click.stop="toggleColor(cur, index)">
                            <img :src="(people.flag || index == 1) ? href[1]: href[0]">{{people.star}}
                        </span>
                        <span class="icon" title="评论">
                            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHRpdGxlPjc1MzFEREU0LTZCMzgtNDI4Ny04QTJBLUY2ODVGMDgzNUFGQzwvdGl0bGU+PGRlZnM+PHJlY3QgaWQ9ImEiIHg9IjU5IiB5PSI1NCIgd2lkdGg9IjU0IiBoZWlnaHQ9IjI1IiByeD0iMSIvPjxtYXNrIGlkPSJiIiB4PSIwIiB5PSIwIiB3aWR0aD0iNTQiIGhlaWdodD0iMjUiIGZpbGw9IiNmZmYiPjx1c2UgeGxpbms6aHJlZj0iI2EiLz48L21hc2s+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02OCAtNTYpIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNCMkJBQzIiIGQ9Ik03MiA2MXY4LjAzOGg0LjQ0NEw4MS4xMTEgNzJ2LTIuOTYySDg0VjYxeiIvPjx1c2Ugc3Ryb2tlPSIjRURFRUVGIiBtYXNrPSJ1cmwoI2IpIiBzdHJva2Utd2lkdGg9IjIiIHhsaW5rOmhyZWY9IiNhIi8+PC9nPjwvc3ZnPg==">
                            {{people.comment}}
                        </span>
                    </button>
            </div>   <!-- .article -->
        </div>  <!-- show[index] --> 
    </div>
</template>

<script>
export default {
    name: 'blogAndStar',
    data() {
        return {
            api: "http://" + location.hostname + ':8080' + "/api?require="
        };
    },
    methods: {
      goToArticle(article_id) {
        this.$router.push('/article/' + article_id);
      },
        toggleColor(cur, index) {
            var num = 0;
            var arr = this.arr;
            var color = ['rgb(178, 186, 194)', 'rgb(29, 196, 0)'];
            var $target = $(".article:nth(" + cur + ") .icon-color");
            var $img = $("img",$target);
            //如果index为0，则是author的name，否则是stars的人的name
            var name = index == 0 ? this.author : arr[index][cur].name;
            num = $target.css('color') == color[0] ? 1 : -1;
            var requerURL = this.api + 'updatestar&num=' + num + '&article_id=' + arr[index][cur].article_id + '&name=' + name;
            $.ajax({
                url: requerURL,
                xhrFields:{withCredentials:true},
                success: (json) => {
                  if(!json.flag) {
                    return alert(json.reason);
                  }
                  var i;
                  num == 1 ? i = 1 : i = 0;
                  $("img",$target).attr('src', this.href[i]);
                  $target.css('color', color[i]);
                  arr[index][cur].star = parseInt(arr[index][cur].star) + num;
                }
            });
        }
    },
    props: ['arr', 'show', 'href', 'author']
}
</script>

<style scoped>
.article {
    box-sizing: border-box;
    background-color: white;
    width: 100%;
    cursor: pointer;
    padding: 15px 30px;
    border: 1px solid #f4f5f6;
}
.article:hover {
    background-color: #fcfcfc;
}
.article button{ font-size: 0;}
.article > span { font-size: 0.77em;}
.article > span:not(:nth-child(1))::before{content: "· ";}
.type { color: #b71ed7;}
.author:hover{ color: #007fff;}
.time {
    margin: 0 10px;
    color:#b6bac2;
}
.title {
    margin: 10px 0px;
    display: block;
    font-size:1.2em;
    font-weight: bold;
}
.title:hover { text-decoration: underline;}
.icon {
    font-size: 13px;
    color: #b2bac2;
    font-weight: bold;
    padding: 3px 10px;
    vertical-align: sub;
    display: inline-block;
    border:1px solid #edeeef;
    background-color: white;
}
.icon:hover { background-color: #f7f8fa;}
.icon img { vertical-align: middle;}
.icon-star { color: rgb(29, 196, 0);}
</style>