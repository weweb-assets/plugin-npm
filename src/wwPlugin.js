/* wwEditor:start */
import './components/SettingsEdit.vue';
import './components/SettingsSummary.vue';
/* wwEditor:end */

export default {
    packages: {},

    async onLoad(packages) {
        await this.addScripts(
            packages && packages.length ? packages : this.settings.publicData.packages,
            wwLib.getFrontDocument()
        );
        /* wwEditor:start */
        await this.addScripts(
            packages && packages.length ? packages : this.settings.publicData.packages,
            wwLib.getEditorDocument()
        );
        /* wwEditor:end */
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
        console.log(packageName, instanceName);
        console.log('getFrontWindow', wwLib.getFrontWindow()[instanceName]);
        console.log('getEditorWindow', wwLib.getEditorWindow()[instanceName]);

        if (wwLib.wwVariable.getValue(`${this.id}-${packageName}`)) {
            wwLib.wwVariable.updateValue(`${this.id}-${packageName}`, wwLib.getFrontWindow()[instanceName]);
            /* wwEditor:start */
            wwLib.wwVariable.updateValue(`${this.id}-${packageName}`, wwLib.getEditorWindow()[instanceName]);
            /* wwEditor:end */

            console.log('variable updated: ', `${this.id}-${packageName}`);
        } else {
            wwLib.wwVariable.registerPluginVariable({
                uid: this.id,
                name: `${packageName}`,
                value: wwLib.getFrontWindow()[instanceName],
                type: 'any',
            });

            /* wwEditor:start */
            wwLib.wwVariable.registerPluginVariable({
                uid: this.id,
                name: `${packageName}`,
                value: wwLib.getEditorWindow()[instanceName],
                type: 'any',
            });
            /* wwEditor:end */

            console.log('variable registered: ', `${this.id}-${packageName}`);
        }
    },

    addScripts(packages, context) {
        const promises = [];

        for (const packageItem of Array.isArray(packages) ? packages : []) {
            promises.push(this.addScript(packageItem, context));
        }

        return Promise.all(promises);
    },
};
