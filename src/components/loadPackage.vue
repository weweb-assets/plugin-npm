<template>
    <wwEditorFormRow label="Package" required>
        <wwEditorInputTextSelect :options="packagesOptions" placeholder="Choose an package" />
    </wwEditorFormRow>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, required: true },
    },
    emits: ['update:args'],
    computed: {
        packagesOptions() {
            return Object.values(this.plugin).map(pack => ({
                label: pack.name,
                value: pack.name,
                icon: 'advanced',
            }));
        },
    },
    mounted() {
        console.log('from action component: ', this.args, this.plugin);
    },
};
</script>
