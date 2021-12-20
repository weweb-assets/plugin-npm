<template>
    <div class="npm-settings-edit">
        <wwEditorInputRow
            label="Packages"
            type="array"
            :model-value="settings.publicData.packages"
            @update:modelValue="changePackages"
            @add-item="changePackages([...(settings.publicData.packages || []), { version: 'latest' }])"
        >
            <template #append-label>
                <a class="npm-settings-edit__link" href="https://www.npmjs.com/" target="_blank"> Find it here </a>
            </template>
            <template #default="{ item, setItem }">
                <wwEditorInputRow
                    type="query"
                    :model-value="item.name"
                    placeholder="Enter a name"
                    small
                    @update:modelValue="setItem({ ...item, name: $event })"
                />
                <wwEditorInputRow
                    type="query"
                    :model-value="item.version"
                    placeholder="Enter a version"
                    small
                    @update:modelValue="setItem({ ...item, version: $event })"
                />
            </template>
        </wwEditorInputRow>
    </div>
</template>

<script>
export default {
    props: {
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
    methods: {
        changePackages(packages) {
            this.$emit('update:settings', { ...this.settings, publicData: { packages } });
        },
    },
};
</script>

<style lang="scss" scoped>
.npm-settings-edit {
    display: flex;
    flex-direction: column;
    &__link {
        color: var(--ww-color-blue-500);
        margin-left: var(--ww-spacing-02);
    }
    &__row {
        display: flex;
        align-items: center;
    }
    &__radio-label {
        margin-left: var(--ww-spacing-02);
    }
}
</style>
