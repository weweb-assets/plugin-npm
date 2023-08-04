export default {
    editor: {
        settings: {
            edit: () => import('./src/components/SettingsEdit.vue'),
            summary: () => import('./src/components/SettingsSummary.vue'),
            getIsValid(settings) {
                return (
                    !!settings.publicData.packages &&
                    !settings.publicData.packages.some(packageItem => !packageItem.name || !packageItem.version)
                );
            },
        },
    },
    variables: settings => {
        return (settings.publicData.packages || []).map(pack => ({
            name: pack.name,
            version: pack.version,
            value: {},
            type: 'object',
            defaultValue: null,
        }));
    },
    actions: [
        {
            name: 'Load package',
            code: 'loadPackage',
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/loadPackage.vue'),
            /* wwEditor:end */
        },
    ],
};
