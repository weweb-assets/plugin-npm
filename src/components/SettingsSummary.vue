<template>
    <div v-for="(packageItem, index) in packages" :key="index" class="npm-settings-summary mb-2">
        <wwEditorIcon large name="code" class="npm-settings-summary__icon" />
        <div class="flex flex-row items-center justify-between w-100">
            <div>
                <span class="caption-m">{{ packageItem.name }}</span>
                <span class="body-md ml-1 content-tertiary">{{ packageItem.version }}</span>
            </div>
        </div>
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
