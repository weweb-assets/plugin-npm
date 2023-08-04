<template>
    <wwEditorInputRow label="Package" type="select" required bindable placeholder="Select a package" />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, required: true },
    },
    emits: ['update:args'],
    computed: {},
    mounted() {
        console.log('from action component: ', this.args, this.plugin);
    },
};
</script>
