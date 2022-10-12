<template>
    <n-tabs
        v-model:value="tabValue"
        justify-content="start"
        type="line"
    >
        <!-- 文章列表 -->
        <n-tab-pane
            name="list"
            tab="文章列表"
        >
            <div
                v-for="(blog,index) in blogListInfo"
                style="margin-bottom:10px"
            >
                <n-card :title="blog.title">
                    {{blog.content}}
                    <template #footer>
                        <n-space align="center">
                            <div>发布时间: {{blog.create_time}}</div>
                            <n-button
                                type="primary"
                                @click="toUpdate(blog)"
                            >修改</n-button>
                            <n-button
                                type="primary"
                                @click="toDelete(blog)"
                            >删除</n-button>
                        </n-space>
                    </template>
                </n-card>
            </div>
            <n-space>
                <div
                    v-for="pageNum in pageInfo.pageCount"
                    @click="toPage(pageNum)"
                    class="page"
                >
                    {{pageNum}}
                </div>
            </n-space>
        </n-tab-pane>
        <!-- 添加文章 -->
        <n-tab-pane
            name="add"
            tab="添加文章"
        >
            <n-form>
                <n-form-item label="标题">
                    <n-input
                        v-model:value="addArticle.title"
                        placeholder="请输入标题"
                        type="text"
                    />
                </n-form-item>
                <n-form-item label="分类">
                    <n-select
                        v-model:value="addArticle.categoryId"
                        :options="categoryOptions"
                    />
                </n-form-item>
                <n-form-item label="内容">
                    <rich-text-editor v-model="addArticle.content"></rich-text-editor>
                </n-form-item>
                <n-form-item label="">
                    <n-button
                        @click="add"
                        type="primary"
                    >提交</n-button>
                </n-form-item>
            </n-form>
        </n-tab-pane>
        <!-- 修改文章 -->
        <n-tab-pane
            name="update"
            tab="更新文章"
        >
            <n-form>
                <n-form-item label="标题">
                    <n-input
                        v-model:value="updateArticle.title"
                        placeholder="请输入标题"
                        type="text"
                    />
                </n-form-item>
                <n-form-item label="分类">
                    <n-select
                        v-model:value="updateArticle.categoryId"
                        :options="categoryOptions"
                    />
                </n-form-item>
                <n-form-item label="内容">
                    <rich-text-editor v-model="updateArticle.content"></rich-text-editor>
                </n-form-item>
                <n-form-item label="">
                    <n-button
                        @click="updateContent"
                        type="primary"
                    >提交</n-button>
                </n-form-item>
            </n-form>
        </n-tab-pane>
    </n-tabs>
</template>

<script setup>
import { reactive, inject, onMounted, ref } from "vue";
import RichTextEditor from "../../components/RichTextEditor.vue";

const axios = inject("axios");
const message = inject("message");
const dialog = inject("dialog");

const tabValue = ref("list")
//新增文章信息
const addArticle = reactive({
    categoryId: 0,
    title: "",
    content: ""
});
//更新文章信息
const updateArticle = reactive({
    id: 0,
    categoryId: 0,
    title: "",
    content: ""
})

//分类选项
const categoryOptions = ref([])
//博客信息
const blogListInfo = ref([])
//分页信息
const pageInfo = reactive({
    page: 1,
    pageSize: 3,
    pageCount: 0,
    count: 0
});

onMounted(() => {
    loadBlogs()
    loadCategorys()
})

//从后端读取分类信息
const loadCategorys = async () => {
    let res = await axios.get("/category/list");
    categoryOptions.value = res.data.rows.map((item) => {
        return {
            label: item.name,
            value: item.id
        }
    })
}

//提交文章到后端
const add = async () => {
    let res = await axios.post("/blog/_token/add", addArticle);
    if (res.data.code == 200) {
        message.info(res.data.msg);
        addArticle.title = "";
        addArticle.categoryId = "";
        addArticle.content = "";
        tabValue.value = "list";
        loadBlogs()
    } else {
        message.error(res.data.msg);
    }
}

//读取博客信息并分页
const loadBlogs = async () => {
    let res = await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
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

//分页跳转
const toPage = async (pageNum) => {
    pageInfo.page = pageNum;
    loadBlogs();
}

//修改文章
const toUpdate = async (blog) => {
    tabValue.value = "update";
    let res = await axios.get("/blog/detail?id=" + blog.id);
    updateArticle.id = blog.id;
    updateArticle.title = res.data.rows[0].title;
    updateArticle.content = res.data.rows[0].content;
    updateArticle.categoryId = res.data.rows[0].category_id;
}

const updateContent = async () => {
    let res = await axios.put("/blog/_token/update", updateArticle);
    if (res.data.code == 200) {
        message.info(res.data.msg);
        updateArticle.title = "";
        updateArticle.categoryId = "";
        updateArticle.content = "";
        tabValue.value = "list";
        loadBlogs();
    } else {
        message.error(res.data.msg);
    }
}

//文章删除
const toDelete = async (blog) => {
    dialog.warning({
        title: "删除操作",
        content: "是否删除",
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => {
            let res = await axios.delete("/blog/_token/delete?id=" + blog.id);
            if (res.data.code == 200) {
                message.info(res.data.msg);
                loadBlogs();
            } else {
                message.error(res.data.msg);
            }
        },
        onNegativeClick: () => { }
    });
}
</script>

<style lang="scss" scoped>
.page {
    border: 1px solid #dcdcdc;
    padding: 0 20px;
    outline: none;
    font-size: 20px;

    &:hover {
        cursor: pointer;
    }
}
</style>
