/* wwEditor:start */
import './components/SettingsEdit.vue';
import './components/SettingsSummary.vue';
/* wwEditor:end */

export default {
    async onLoad(settings) {
        await this.addScripts(settings.publicData.packages, wwLib.getFrontDocument());
        /* wwEditor:start */
        await this.addScripts(settings.publicData.packages, wwLib.getEditorDocument());
        /* wwEditor:end */
    },

    reloadPackages(settings) {
        this.onLoad(settings);
    },

    addScript(packageItem, context) {
        return new Promise(resolve => {
            const packageSrc = `https://unpkg.com/${packageItem.name}@${packageItem.version}`;
            const script = context.createElement('script');
            script.type = 'text/javascript';
            script.src = packageSrc;

            script.onload = () => {
                this.updatePluginVariables(packageItem.name, packageItem.instanceName);
                resolve();
            };

            context.head.appendChild(script);
        });
    },

    updatePluginVariables(packageName, instanceName) {
        /* wwEditor:start */
        if (!wwLib.wwVariable.getValue(`${this.id}-${packageName}`)) {
            wwLib.wwVariable.registerPluginVariable({
                uid: this.id,
                name: `${packageName}`,
                value: wwLib.getFrontWindow()[instanceName],
                defaultValue: wwLib.getFrontWindow()[instanceName],
                type: 'any',
            });

            wwLib.wwVariable.registerPluginVariable({
                uid: this.id,
                name: `${packageName}`,
                value: wwLib.getEditorWindow()[instanceName],
                defaultValue: wwLib.getFrontWindow()[instanceName],
                type: 'any',
            });
        }
        /* wwEditor:end */

        wwLib.wwVariable.updateValue(`${this.id}-${packageName}`, wwLib.getFrontWindow()[instanceName]);
        /* wwEditor:start */
        wwLib.wwVariable.updateValue(`${this.id}-${packageName}`, wwLib.getEditorWindow()[instanceName]);
        /* wwEditor:end */
    },

    addScripts(packages, context) {
        const promises = [];

        for (const packageItem of Array.isArray(packages) ? packages : []) {
            promises.push(this.addScript(packageItem, context));
        }

        return Promise.all(promises);
    },
};
