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
