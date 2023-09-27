<template>
    <div class="npm-settings-edit">
        <div class="installedPackage mb-4" v-if="settings.publicData?.packages?.length">
            <div
                v-for="(pack, index) in settings.publicData.packages"
                class="flex flex-row justify-between mb-3 items-center"
            >
                <span class="flex flex-col items-start w-100">
                    <span class="label-2 text-stale-900 mb-2">
                        <a :href="pack.link" target="_blank">{{ pack.name }}</a>
                    </span>

                    <div class="flex flex-row items-start w-100">
                        <div class="flex flex-col w-50 pr-2">
                            <span class="label-sm text-stale-500 mb-1">Package version</span>
                            <input
                                v-model="pack.version"
                                class="ww-editor-input version-input -small w-100"
                                type="text"
                                :placeholder="pack.version"
                            />
                        </div>

                        <div class="flex flex-col w-50 pr-2">
                            <span class="label-sm text-stale-500 mb-1">Instance name</span>
                            <input
                                v-model="pack.instanceName"
                                class="ww-editor-input instanceName-input -small w-100"
                                type="text"
                                placeholder="Instance name"
                                @input="updateInstanceName(pack.name, pack.instanceName)"
                            />
                        </div>
                    </div>
                </span>

                <button
                    type="button"
                    class="ww-editor-button -icon -tertiary -red -small m-auto-left"
                    @click="removePackage(index)"
                >
                    <wwEditorIcon class="ww-editor-button-icon" name="trash" small />
                </button>
            </div>
        </div>

        <div>
            <wwEditorFormRow label="Search for a package">
                <wwEditorInputText
                    class="-full"
                    v-model="searchedPackages"
                    placeholder="Search for a package"
                    @keyup="searchPackages"
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
                        <span class="label-2 text-stale-900 mb-1 flex flex-row items-end">
                            <a :href="pack.links?.homepage" target="_blank">{{ pack.name }}</a>
                            <span class="body-sm ml-2 text-stale-500">{{ pack.version }}</span>
                        </span>
                        <span class="flex flex-row justify-between">
                            <a :href="pack.links?.repository" target="_blank">
                                <wwEditorIcon name="github" class="text-stale-900" />
                            </a>
                        </span>
                    </div>
                    <div class="body-sm mb-2 text-stale-500" v-if="pack.author?.name">
                        {{ pack.author?.name }}
                    </div>
                    <div class="body-sm mb-2 text-stale-500" v-else-if="pack.publisher?.username">
                        {{ pack.publisher?.username }}
                    </div>
                    <div class="body-sm mb-2">
                        {{ pack.description }}
                    </div>

                    <div
                        class="ww-editor-button -primary -small m-auto-left"
                        v-if="!selectedPackages.includes(pack.name)"
                        @click="selectPackage(pack)"
                    >
                        <wwEditorIcon class="ww-editor-button-icon" name="plus" small />
                        add
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
        availablePackages() {
            if (!this.packagesResults && !Array.isArray(this.packagesResults)) return [];
            return this.packagesResults.map(pack => ({ label: pack.name, value: pack.name, detail: pack.name }));
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
                try {
                    const response = await wwAxios.get(
                        `https://api.npms.io/v2/search?q=${this.searchedPackages}&size=10`
                    );

                    this.packagesResults = response.data.results.map(result => result.package);
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
        selectPackage(pack) {
            this.searchedPackages = '';
            this.packagesResults = [];
            this.changePackages([
                ...(this.settings.publicData.packages || []),
                {
                    name: pack.name,
                    version: pack.version,
                    link: pack.links?.homepage,
                    instanceName: dictionary.find(d => d.packageName === pack.name)?.instanceName || '',
                },
            ]);

            this.plugin.addScript(pack, wwLib.getFrontDocument());
            this.plugin.addScript(pack, wwLib.getEditorDocument());
        },
        removePackage(index) {
            const packages = [...this.settings.publicData.packages];
            packages.splice(index, 1);
            this.changePackages(packages);
            this.updateAndLoad();
        },
        updateInstanceName(packageName, instanceName) {
            this.plugin.updateInstanceName(packageName, instanceName);
        },
        loadInstance() {
            this.plugin.onLoad();
        },
        updateAndLoad() {
            this.$nextTick(this.loadInstance());
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

.loader {
    position: relative;
    margin-top: var(--ww-spacing-02);
}

.error {
    background-color: var(--ww-color-yellow-50);
    border: 1px solid var(--ww-color-yellow-100);
    color: var(--ww-color-yellow-500);
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
    background-color: var(--ww-color-theme-dark-50);
    border-radius: var(--ww-border-radius-02);
    border: 1px solid var(--ww-color-theme-dark-100);
    overflow: hidden;
    transition: border-color 0.3s ease, background-color 0.3s ease;
    will-change: border-color, background-color;

    &.-selected:hover,
    &.-selected {
        border-color: var(--ww-color-green-500);
    }

    &:hover {
        border: 1px solid var(--ww-color-blue-500);
    }
}

.m-auto-left {
    margin-left: auto;
}
</style>
