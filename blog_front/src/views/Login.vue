<template>
    <div class="login-panel">
        <n-card title="登录">
            <n-form
                :rules="rules"
                :model="admin"
            >
                <n-form-item
                    path="account"
                    label="账号"
                >
                    <n-input
                        v-model:value="admin.account"
                        placeholder="请输入账号"
                    />
                </n-form-item>
                <n-form-item
                    path="password"
                    label="密码"
                >
                    <n-input
                        v-model:value="admin.password"
                        type="password"
                        placeholder="请输入密码"
                    />
                </n-form-item>
            </n-form>
            <template #footer>
                <n-checkbox
                    v-model:checked="admin.rember"
                    label="记住我"
                />
                <n-button @click="login">登录</n-button>
            </template>
        </n-card>
    </div>
</template>

<script setup>
import { reactive, inject } from "vue";
import { AdminStore } from "../stores/AdminStore";
import { useRouter } from "vue-router";

const router = useRouter();
const axios = inject("axios");
const message = inject("message");
const adminStore = AdminStore();

//账户信息
const admin = reactive({
    account: localStorage.getItem("account") || "",
    password: localStorage.getItem("password") || "",
    rember: localStorage.getItem("rember") == 1
})

//检验规则
let rules = {
    account: [
        { required: true, message: "请输入账号", trigger: "blur" },
        { min: 3, max: 12, message: "账号长度在3到12个字符", trigger: "blur" }
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 18, message: "密码长度在6到18个字符", trigger: "blur" }
    ]
}

//登录
const login = async () => {
    let result = await axios.post("/admin/login", {
        account: admin.account,
        password: admin.password
    });
    if (result.data.code == 200) {
        adminStore.token = result.data.data.token;
        adminStore.id = result.data.data.id;
        adminStore.account = result.data.data.account;
        if (admin.rember) {
            localStorage.setItem("account", admin.account);
            localStorage.setItem("password", admin.password);
            localStorage.setItem("rember", admin.rember ? 1 : 0);
        }
        router.push("/dashboard/article")
        message.info("登录成功");
    } else {
        message.error("登录失败");
    }
}
</script>

<style lang="scss" scoped>
.login-panel {
    width: 500px;
    margin: 0 auto;
    margin-top: 130px;
    border-radius: 5px;

    &:hover {
        box-shadow: 0 0 5px rgb(142, 140, 140);
    }
}
</style>