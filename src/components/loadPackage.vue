<template>
    <wwEditorInputRow label="Package" type="select" required placeholder="Select a package" />
    TEST
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, required: true },
    },
    emits: ['update:args'],
    computed: {
        // packagesOptions() {
        //     return Object.values(this.plugin).map(collection => ({
        //         label: collection.name,
        //         value: collection.id,
        //         icon: this.getPluginById(collection.pluginId).icon,
        //     }));
        // },
    },
    mounted() {
        console.log('from action component: ', this.args, this.plugin);
    },
};
</script>
