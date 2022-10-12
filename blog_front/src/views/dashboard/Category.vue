<template>
    <div>
        <n-button
            @click="showAddModal = true"
            style="margin-bottom:5px"
            type="primary"
        >添加</n-button>
        <!-- 表格数据 -->
        <n-table
            :bordered="false"
            :single-line="false"
        >
            <thead>
                <tr>
                    <th>编号</th>
                    <th>名称</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(category,index) in categoryList">
                    <td>{{category.id}}</td>
                    <td>{{category.name}}</td>
                    <td>
                        <n-space>
                            <n-button
                                @click="toUpdate(category)"
                                type="primary"
                            >修改</n-button>
                            <n-button
                                @click="deleteCategory(category)"
                                type="primary"
                            >删除</n-button>
                        </n-space>
                    </td>
                </tr>
            </tbody>
        </n-table>
        <!-- 添加分类 -->
        <n-modal
            v-model:show="showAddModal"
            preset="dialog"
            title="Dialog"
        >
            <template #header>
                <div>添加分类</div>
            </template>
            <div>
                <n-input
                    v-model:value="addCategory.name"
                    type="text"
                    placeholder="请输入分类名"
                ></n-input>
            </div>
            <template #action>
                <div>
                    <n-button
                        type="primary"
                        @click="Add"
                    >提交</n-button>
                </div>
            </template>
        </n-modal>
        <!-- 修改分类 -->
        <n-modal
            v-model:show="showUpdateModal"
            preset="dialog"
            title="Dialog"
        >
            <template #header>
                <div>修改分类</div>
            </template>
            <div>
                <n-input
                    v-model:value="updateCategory.name"
                    type="text"
                    placeholder="请输入分类名"
                ></n-input>
            </div>
            <template #action>
                <div>
                    <n-button
                        type="primary"
                        @click="update"
                    >提交</n-button>
                </div>
            </template>
        </n-modal>
    </div>
</template>

<script setup>
import { reactive, ref, inject, onMounted } from "vue";

const axios = inject("axios");
const message = inject("message");
const dialog = inject("dialog");

//添加model
const showAddModal = ref(false);
//修改model
const showUpdateModal = ref(false);

const categoryList = ref([])

const addCategory = reactive({
    name: ""
});

const updateCategory = reactive({
    id: 0,
    name: ""
})
onMounted(() => {
    loadDatas()
})

const loadDatas = async () => {
    let res = await axios.get("/category/list");
    categoryList.value = res.data.rows;
}

//添加分类
const Add = async () => {
    let res = await axios.post("/category/_token/add", { name: addCategory.name });
    if (res.data.code == 200) {
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
    showAddModal.value = false;
    loadDatas();
    addCategory.name = "";
}

//修改分类
const update = async () => {
    let res = await axios.put("/category/_token/update", { id: updateCategory.id, name: updateCategory.name })
    if (res.data.code == 200) {
        loadDatas();
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
    showUpdateModal.value = false;
}
const toUpdate = async (category) => {
    showUpdateModal.value = true;
    updateCategory.id = category.id;
    updateCategory.name = category.name;
}

//删除分类,query方式传值
const deleteCategory = async (category) => {
    dialog.warning({
        title: "删除操作",
        content: "是否删除",
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => {
            let res = await axios.delete(`/category/_token/delete?id=${category.id}`);
            if (res.data.code == 200) {
                message.info(res.data.msg)
            } else {
                message.error(res.data.msg)
            }
            loadDatas();
        },
        onNegativeClick: () => { }
    });

}
</script>
