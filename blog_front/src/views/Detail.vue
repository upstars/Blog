<template>
    <div class="container">
        <n-button
            @click="backToHome"
            style="margin-top:10px"
            id="topTitle"
        >返回</n-button>
        <n-h1>{{blogInfo.title}}</n-h1>
        <div class="blog-content">
            <div v-html="blogInfo.content"></div>
        </div>
        <n-button class="foot-button"><a href="#topTitle">回到顶部</a></n-button>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { onMounted, inject, ref } from "vue";

const router = useRouter();
const route = useRoute();
const axios = inject("axios");

const blogInfo = ref({})

const backToHome = () => {
    router.push("/");
}

//获取文章详细信息
const loadBlog = async () => {
    let res = await axios.get("/blog/detail?id=" + route.query.id);
    blogInfo.value = res.data.rows[0];
}

onMounted(() => {
    loadBlog()
})
</script>

<style lang="scss" scoped>
.container {
    width: 1200px;
    margin: 0 auto;

    .foot-button {
        position: fixed;
        bottom: 20px;
        right: 20px;

        a {
            text-decoration: none;
        }
    }
}
</style>

<style>
.blog-content img {
    max-width: 100% !important;
}
</style>