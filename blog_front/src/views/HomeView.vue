<template>
    <div class="container">
        <div class="nav">
            <div @click="homePage">首页</div>
            <div>
                <n-popselect
                    v-model:value="selectedCategory"
                    :options="categoryOptions"
                    trigger="click"
                    @update:value="searchByCategory"
                >
                    <div>分类<span style="font-Size:15px">{{categoryName}}</span></div>
                </n-popselect>
            </div>
            <div @click="dashBoard">后台</div>
        </div>
        <n-divider />
        <n-space style="margin-bottom:10px">
            <n-input
                v-model:value="pageInfo.keyword"
                :style="{width:'500px'}"
                placeholder="请输入关键字"
            ></n-input>
            <n-button
                type="primary"
                ghost
                @click="loadBlogs(0)"
            >搜索</n-button>
        </n-space>
        <div
            v-for="(blog,index) in blogListInfo"
            style="margin-bottom:10px"
            @click="toDetail(blog)"
            class="card"
        >
            <n-card :title="blog.title">
                {{blog.content}}
                <template #footer>
                    <n-space align="center">
                        <div>发布时间: {{blog.create_time}}</div>
                    </n-space>
                </template>
            </n-card>
        </div>
        <n-pagination
            v-model:page="pageInfo.page"
            :page-count="pageInfo.pageCount"
            @update:page="loadBlogs"
        />
        <n-divider />
        <div class="footer">
            <div>Power By XLTC</div>
            <div>XICP备XXXXX-1号</div>
        </div>
    </div>

</template>

<script setup>
import { inject, ref, onMounted, computed, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const axios = inject("axios");

const selectedCategory = ref(0)
const categoryOptions = ref([])
const pageInfo = reactive({
    page: 1,
    pageSize: 3,
    pageCount: 0,
    count: 0,
    keyword: "",
    categoryId: 0
});
//博客信息
const blogListInfo = ref([])

//计算属性,寻找选中分类选项
const categoryName = computed(() => {
    let selectedOption = categoryOptions.value.find((option) => {
        return option.value == selectedCategory.value;
    })
    return selectedOption ? selectedOption.label : "";
})

onMounted(() => {
    loadCategorys();
    loadBlogs();
})

const loadCategorys = async () => {
    let res = await axios.get("/category/list");
    categoryOptions.value = res.data.rows.map((item) => {
        return {
            label: item.name,
            value: item.id
        }
    })
}

//跳转到后台登录页
const dashBoard = () => {
    router.push("/login");
}

//跳转到首页
const homePage = () => {
    router.push("/");
}

//读取文章信息
const loadBlogs = async (page = 0) => {
    if (page != 0) {
        pageInfo.page = page;
    }
    let res = await axios.get(`/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&categoryId=${pageInfo.categoryId}`)
    //在文章后面加上省略号
    let temp_rows = res.data.data.rows;
    for (let row of temp_rows) {
        row.content += "...";
        //转换时间戳
        let d = new Date(row.create_time);
        row.create_time = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
    }
    blogListInfo.value = temp_rows;
    //计算页面有多少
    pageInfo.count = res.data.data.count;
    pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0);
}

//跳转文章详情页
const toDetail = (blog) => {
    router.push({ path: "/detail", query: { id: blog.id } })
}

//按照分类查找
const searchByCategory = (categoryId) => {
    pageInfo.categoryId = categoryId;
    loadBlogs();
}
</script>

<style lang="scss" scoped>
.container {
    width: 1200px;
    margin: 0 auto;

    .nav {
        display: flex;
        font-size: 20px;
        padding-top: 20px;
        color: #000000;
        justify-content: space-around;

        div {
            cursor: pointer;
            margin-right: 15px;

            &:hover {
                color: rgb(7, 92, 85);
            }
        }
    }

    .card {
        &:hover {
            cursor: pointer;
        }
    }

    .footer {
        text-align: center;
        color: rgb(181, 181, 181);
    }
}
</style>