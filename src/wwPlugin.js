/* wwEditor:start */
import './components/SettingsEdit.vue';
import './components/SettingsSummary.vue';
import './components/loadPackage.vue';
/* wwEditor:end */

export default {
    packages: {},

    async onLoad() {
        this.addScripts(this.settings.publicData.packages, wwLib.getFrontDocument());
        /* wwEditor:start */
        this.addScripts(this.settings.publicData.packages, wwLib.getEditorDocument());
        /* wwEditor:end */
    },

    loadPackage() {
        this.addScript(this.settings.publicData.packages[0], wwLib.getFrontDocument());
        /* wwEditor:start */
        this.addScript(this.settings.publicData.packages[0], wwLib.getEditorDocument());
        /* wwEditor:end */
    },

    addScript(packageItem, context) {
        const packageSrc = `https://unpkg.com/${packageItem.name}@${packageItem.version}`;
        const existingScript = context.querySelector(`script[src="${packageSrc}"]`);
        if (existingScript) return;

        const script = context.createElement('script');
        script.type = 'text/javascript';
        script.src = packageSrc;

        context.head.appendChild(script);

        wwLib.wwVariable.updateValue(`${this.id}-${packageItem.name}`, window[packageItem.name]);
    },

    addScripts(packages, context) {
        for (const packageItem of packages || []) {
            this.addScript(packageItem, context);
        }
    },

    updatePluginVariables() {},
};
