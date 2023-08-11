/* wwEditor:start */
import './components/SettingsEdit.vue';
import './components/SettingsSummary.vue';
/* wwEditor:end */

export default {
    packages: {},

    async onLoad() {
        await this.addScripts(this.settings.publicData.packages, wwLib.getFrontDocument());
        /* wwEditor:start */
        await this.addScripts(this.settings.publicData.packages, wwLib.getEditorDocument());
        /* wwEditor:end */
    },

    addScript(packageItem, context) {
        return new Promise(resolve => {
            const packageSrc = `https://unpkg.com/${packageItem.name}@${packageItem.version}`;
            const script = context.createElement('script');
            script.type = 'text/javascript';
            script.src = packageSrc;

            script.onload = () => {
                this.updateInstanceName(packageItem.name, packageItem.instanceName);
                resolve();
            };

            context.head.appendChild(script);
        });
    },

    updateInstanceName(packageName, instanceName) {
        wwLib.wwVariable.updateValue(`${this.id}-${packageName}`, wwLib.getFrontWindow()[instanceName]);
        /* wwEditor:start */
        wwLib.wwVariable.updateValue(`${this.id}-${packageName}`, wwLib.getEditorWindow()[instanceName]);
        /* wwEditor:end */
    },

    addScripts(packages, context) {
        const promises = [];

        for (const packageItem of packages || []) {
            promises.push(this.addScript(packageItem, context));
        }

        return Promise.all(promises);
    },
};
