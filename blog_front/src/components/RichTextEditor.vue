<template>
    <div>
        <Toolbar
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            :mode="mode"
            style="border-bottom: 1px solid #ccc"
        />
        <Editor
            :defaultConfig="editorConfig"
            :mode="mode"
            v-model="valueHtml"
            style="height: 400px; overflow-y: hidden"
            @onCreated="handleCreated"
            @onChange="handleChange"
        />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import { ref, shallowRef, onBeforeUnmount, onMounted, inject } from "vue";
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
const toolbarConfig = { excludeKeys: ["uploadVideo"] };
const mode = ref("default");
const editorConfig = { placeholder: '请输入内容...' };


//上传图片，服务端地址
editorConfig.MENU_CONF = {}
const server_url = inject("server_url");
editorConfig.MENU_CONF['uploadImage'] = {
    server: server_url + "/upload/rich_editor_upload",
    base64LimitSize: 10 * 1024 // 10kb,小于该值就插入 base64 格式（而不上传），默认为 0
}
//插入图片之前处理
editorConfig.MENU_CONF['insertImage'] = {
    parseImageSrc: (src) => {
        if (src.indexOf("http") !== 0) {
            return `${server_url}${src}`
        }
        return src;
    }
}

//富文本中的值
const valueHtml = ref("");

//从父组件传过来的值
const props = defineProps({
    modelValue: {
        type: String,
        default: ""
    }
});

//提交事件
const emit = defineEmits(["update:modelValue"]);

let initFinished = false;

// 模拟 ajax 异步获取内容
onMounted(() => {
    setTimeout(() => {
        valueHtml.value = props.modelValue;
        initFinished = true;
    }, 10);
});

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
    // console.log('created', editor);
    // 记录 editor 实例，重要！
    editorRef.value = editor;
};

//当富文本中内容改变时就提交事件
const handleChange = () => {
    if (initFinished) {
        emit("update:modelValue", valueHtml.value)//第二个参数是提交的值
    }
};
</script>

<style lang="scss" scoped>

</style>