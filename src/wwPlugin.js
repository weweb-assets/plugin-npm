/* wwEditor:start */
import './components/SettingsEdit.vue';
import './components/SettingsSummary.vue';
/* wwEditor:end */

export default {
    async onLoad(settings) {
        const front = wwLib.getFrontDocument();
        await this.addScripts(settings.publicData?.packages, front);
        /* wwEditor:start */
        // The previous editor has a second document. The isolated runtime has one.
        const editor = wwLib.getEditorDocument();
        if (editor && editor !== front) await this.addScripts(settings.publicData?.packages, editor);
        /* wwEditor:end */
    },

    reloadPackages(settings) {
        this.onLoad(settings);
    },

    addScript(packageItem, context) {
        return new Promise((resolve, reject) => {
            const packageSrc = `https://unpkg.com/${packageItem.name}@${packageItem.version}`;
            const script = context.createElement('script');
            script.type = 'text/javascript';
            script.src = packageSrc;

            script.onload = () => {
                this.updatePluginVariables(packageItem.name, packageItem.instanceName);
                resolve();
            };

            script.onerror = () => {
                reject();
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

            if (wwLib.getEditorWindow() !== wwLib.getFrontWindow()) {
                wwLib.wwVariable.registerPluginVariable({
                    uid: this.id,
                    name: packageName,
                    value: wwLib.getEditorWindow()[instanceName],
                    defaultValue: wwLib.getFrontWindow()[instanceName],
                    type: 'any',
                });
            }
        }
        /* wwEditor:end */

        wwLib.wwVariable.updateValue(`${this.id}-${packageName}`, wwLib.getFrontWindow()[instanceName]);
        /* wwEditor:start */
        if (wwLib.getEditorWindow() !== wwLib.getFrontWindow()) {
            wwLib.wwVariable.updateValue(`${this.id}-${packageName}`, wwLib.getEditorWindow()[instanceName]);
        }
        /* wwEditor:end */
    },

    addScripts(packages = [], context) {
        const promises = [];

        for (const packageItem of Array.isArray(packages) ? packages : []) {
            promises.push(this.addScript(packageItem, context));
        }

        return Promise.all(promises);
    },
};
