<template>
    <p class="label-sm flex items-center content-warning border-yellow-500 p-3 mb-3">
        <wwEditorIcon class="mr-3" name="warning" small />
        Some packages can create conflicts in the Editor. Please consider trying to remove your installed packages if
        you encounter any issues.
    </p>
    <div class="npm-settings-edit">
        <div class="installedPackage mb-4" v-if="settings.publicData?.packages?.length">
            <div
                v-for="(pack, index) in settings.publicData.packages"
                class="flex flex-row justify-between mb-3 items-center"
            >
                <div class="flex flex-col items-start w-100">
                    <div class="label-2 content-primary mb-2 flex items-center">
                        <span>{{ pack.name }}</span>

                        <a
                            class="ww-editor-link ml-2 label-3 flex items-center"
                            :href="`https://unpkg.com/${pack.name}@${pack.version}`"
                            target="_blank"
                        >
                            Open on UNPKG
                            <wwEditorIcon class="ml-1" name="arrow-diagonal" small />
                        </a>
                    </div>

                    <div class="flex flex-row items-start w-100">
                        <div class="flex flex-col w-50 pr-2">
                            <span class="label-sm content-tertiary mb-1">Package version</span>
                            <input
                                v-model="pack.version"
                                class="ww-editor-input version-input -small w-100"
                                type="text"
                                :placeholder="pack.version"
                            />
                        </div>

                        <div class="flex flex-col w-50 pr-2">
                            <span class="label-sm content-tertiary mb-1">Global property</span>
                            <input
                                v-model="pack.instanceName"
                                class="ww-editor-input instanceName-input -small w-100"
                                type="text"
                                placeholder="Property name"
                                @input="updatePluginVariables(pack.name, pack.instanceName)"
                            />
                        </div>
                        <button
                            type="button"
                            class="ww-editor-button -icon -tertiary -small m-auto-left"
                            @click="removePackage(index)"
                        >
                            <wwEditorIcon class="ww-editor-button-icon" name="trash" small />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <wwEditorFormRow label="Search for a package">
                <wwEditorInputText
                    class="-full"
                    v-model="searchedPackages"
                    placeholder="Search for a package"
                    @keyup="debouncedSearch"
                />
            </wwEditorFormRow>

            <div v-if="packagesResults.length && searchedPackages.length">
                <div
                    v-for="(pack, index) in packagesResults"
                    :key="index"
                    class="ww-package-preview p-2 mb-2"
                    :class="{ '-selected': selectedPackages.includes(pack.name) }"
                >
                    <div class="flex flex-row justify-between">
                        <span class="label-2 content-primary mb-1 flex flex-row items-end">
                            <a :href="pack.links?.homepage" target="_blank">{{ pack.name }}</a>
                            <span class="body-sm ml-2 content-tertiary">{{ pack.version }}</span>
                        </span>
                        <span class="flex flex-row justify-between">
                            <a :href="pack.links?.repository" target="_blank">
                                <wwEditorIcon name="github" class="content-primary" />
                            </a>
                        </span>
                    </div>
                    <div class="body-sm mb-2 content-tertiary" v-if="pack.author?.name">
                        {{ pack.author?.name }}
                    </div>
                    <div class="body-sm mb-2 content-tertiary" v-else-if="pack.publisher?.username">
                        {{ pack.publisher?.username }}
                    </div>
                    <div class="body-sm mb-2">
                        {{ pack.description }}
                    </div>

                    <div
                        class="ww-editor-button -primary -small m-auto-left"
                        v-if="pack.available && !selectedPackages.includes(pack.name)"
                        @click="selectPackage(pack)"
                    >
                        <wwEditorIcon class="ww-editor-button-icon" name="plus" small />
                        add
                    </div>
                    <div v-else-if="!pack.available" class="ww-editor-button content-alert -small m-auto-left">
                        Not available on UNPKG
                    </div>
                </div>
            </div>
            <div class="loader ww-editor-form-row" v-if="isLoading">
                <wwLoader :loading="isLoading"></wwLoader>
            </div>
            <div class="error ww-editor-form-row p-2" v-if="errorMessage">
                <p class="body-sm">{{ errorMessage }}</p>
                <span @click="searchPackages" class="try-again body-sm mt-2 m-auto-left">Try again</span>
            </div>
        </div>
    </div>
</template>

<script>
import dictionary from '../packageDictionary';

export default {
    props: {
        plugin: { type: Object, required: true },
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
    data() {
        return {
            searchedPackages: '',
            packagesResults: [],
            selectedPackage: '',
            debouncedSearch: null,
            isLoading: false,
            errorMessage: '',
        };
    },
    created() {
        this.debouncedSearch = this.debounce(this.searchPackages, 300);
    },
    computed: {
        selectedPackages() {
            return (this.settings.publicData.packages || []).map(pack => pack.name);
        },
    },
    methods: {
        changePackages(packages) {
            this.$emit('update:settings', { ...this.settings, publicData: { packages } });
        },
        async searchPackages() {
            this.errorMessage = '';
            if (this.searchedPackages.length > 1) {
                this.isLoading = true;
                this.packagesResults = [];
                try {
                    const { data } = await wwAxios.get(
                        `${wwLib.wwApiRequests._getPluginsUrl()}/designs/${
                            wwLib.wwWebsiteData.getInfo().id
                        }/npm/search?text=${this.searchedPackages}&size=10`
                    );
                    const packages =
                        data?.objects?.map(async result => {
                            const available = await this.checkPackageAvailability(result.package);
                            return {
                                ...result.package,
                                available,
                            };
                        }) || [];
                    this.packagesResults = await Promise.all(packages);
                } catch (error) {
                    console.error(error);
                    this.errorMessage =
                        'An error has been encountered while searching for packages. Please try again later';
                    this.packagesResults = [];
                }
                this.isLoading = false;
            } else {
                this.packagesResults = [];
            }
        },
        debounce(func, wait) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },
        async checkPackageAvailability(pack) {
            try {
                return (await fetch(`https://unpkg.com/${pack.name}@${pack.version}`)).ok;
            } catch (error) {
                return false;
            }
        },
        async selectPackage(pack) {
            this.searchedPackages = '';
            this.packagesResults = [];
            const updatedPackages = [
                ...(this.settings.publicData.packages || []),
                {
                    name: pack.name,
                    version: pack.version,
                    link: pack.links?.homepage,
                    instanceName: dictionary.find(d => d.packageName === pack.name)?.instanceName || '',
                },
            ];

            this.changePackages(updatedPackages);
        },
        removePackage(index) {
            const removedPackage = this.settings.publicData.packages[index];
            if (removedPackage.instanceName) {
                wwLib.wwVariable.unregisterPluginVariable(`${this.id}-${removedPackage.instanceName}`);
            }

            const packages = [...this.settings.publicData.packages];
            packages.splice(index, 1);
            this.changePackages(packages);
        },
    },
};
</script>

<style lang="scss" scoped>
.npm-settings-edit {
    display: flex;
    flex-direction: column;
    &__link {
        color: var(--ww-color-content-brand);
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

.loader {
    position: relative;
    margin-top: var(--ww-spacing-02);
}

.error {
    background-color: var(--ww-color-bg-warning-secondary);
    border: 1px solid var(--ww-color-border-warning-secondary);
    color: var(--ww-color-content-warning);
    padding: var(--ww-spacing-02);
    border-radius: var(--ww-border-radius-02);

    .try-again {
        cursor: pointer;
        text-decoration: underline;
    }
}

.ww-package-preview {
    --default-padding: 1px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: var(--ww-color-bg-secondary);
    border-radius: var(--ww-border-radius-02);
    border: 1px solid var(--ww-color-border);
    overflow: hidden;
    transition: border-color 0.3s ease, background-color 0.3s ease;
    will-change: border-color, background-color;

    &.-selected:hover,
    &.-selected {
        border-color: var(--ww-color-border-success);
    }

    &:hover {
        border: 1px solid var(--ww-color-border-brand);
    }
}

.m-auto-left {
    margin-left: auto;
}
</style>
