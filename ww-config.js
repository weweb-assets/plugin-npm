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
};
