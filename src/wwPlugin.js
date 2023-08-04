/* wwEditor:start */
import './components/SettingsEdit.vue';
import './components/SettingsSummary.vue';
import './components/loadPackage.vue';
/* wwEditor:end */

export default {
    packages: {},

    onLoad() {
        this.addScripts(this.settings.publicData.packages, wwLib.getFrontDocument());
    },

    loadPackage() {
        this.addScript(this.settings.publicData.packages[0], wwLib.getFrontDocument());
    },

    load() {
        this.addScripts(this.settings.publicData.packages, wwLib.getFrontDocument());
    },

    addScript(packageItem, context) {
        const packageSrc = `https://unpkg.com/${packageItem.name}@${packageItem.version}`;
        const existingScript = context.querySelector(`script[src="${packageSrc}"]`);
        if (existingScript) return;

        const script = context.createElement('script');
        script.type = 'text/javascript';
        script.src = packageSrc;
        script.onload = () => {
            this.packages[packageItem.name] = wwLib.getFrontWindow()[packageItem.name];
        };

        context.head.appendChild(script);
    },

    addScripts(packages, context) {
        for (const packageItem of packages) {
            if (packageItem.auto) this.addScript(packageItem, context);
        }
    },
};
