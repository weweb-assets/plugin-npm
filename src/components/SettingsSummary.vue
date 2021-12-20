<template>
    <div v-for="(packageItem, index) in packages" :key="index" class="npm-settings-summary">
        <wwEditorIcon large name="library" class="npm-settings-summary__icon" />
        <span class="caption-m">{{ packageItem.name }}</span>
    </div>
</template>

<script>
export default {
    props: {
        settings: { type: Object, required: true },
    },
    computed: {
        packages() {
            return this.settings.publicData.packages || [];
        },
    },
};
</script>

<style lang="scss" scoped>
.npm-settings-summary {
    display: flex;
    align-items: center;
    &__icon {
        margin-right: var(--ww-spacing-02);
    }
}
</style>
