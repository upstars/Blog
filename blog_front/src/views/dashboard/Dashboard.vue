<template>
    <div class="main">
        <div class="menus">
            <div
                v-for="(menu,index) in menus"
                @click="toPage(menu)"
                :key="index"
            >{{menu.name}}</div>
        </div>
        <div style="padding:20px;width:100%">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

let menus = [
    { name: "文章管理", href: "/dashboard/article" },
    { name: "分类管理", href: "/dashboard/category" },
    { name: "退出", href: "logout" }
]

//退出登录
const toPage = (menu) => {
    if (menu.href == "logout") {
        router.push("/login");
    } else {
        router.push(menu.href);
    }
}
</script>

<style lang="scss" scoped>
.main {
    display: flex;
    color: #64676a;
    margin: 0 auto;
}

.menus {
    padding: 20px 0;
    box-sizing: border-box;
    line-height: 55px;
    text-align: center;
    width: 180px;
    height: 95vh;
    border-right: 1px solid #dadada;

    div {
        cursor: pointer;

        &:hover {
            color: #fd760e;
        }
    }
}
</style>