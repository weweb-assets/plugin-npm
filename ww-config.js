export default {
    editor: {
        settings: {
            icon: 'npm',
            edit: () => import('./src/components/SettingsEdit.vue'),
            summary: () => import('./src/components/SettingsSummary.vue'),
            getIsValid(settings) {
                return (
                    !!settings.publicData.packages &&
                    !settings.publicData.packages.some(packageItem => !packageItem.name || !packageItem.version)
                );
            },
            onSave: 'reloadPackages',
            /* wwEditor:start */
            copilot: {
                description: 'Loads and manages NPM packages in your project',
                returns: 'object',
                schema: {
                    packages: {
                        type: 'array',
                        description: 'Array of NPM packages to load',
                        bindable: false,
                        schema: {
                            name: {
                                type: 'string',
                                description: 'Name of the NPM package',
                                bindable: false
                            },
                            version: {
                                type: 'string',
                                description: 'Version of the NPM package',
                                bindable: false
                            },
                            instanceName: {
                                type: 'string',
                                description: 'Global variable name to access the package',
                                bindable: false
                            }
                        }
                    }
                }
            }
            /* wwEditor:end */
        },
    },
    variables: settings => {
        return (settings?.publicData?.packages || []).map(pack => ({
            name: pack.name,
            version: pack.version,
            value: {},
            type: 'any',
            defaultValue: null,
        }));
    },
};