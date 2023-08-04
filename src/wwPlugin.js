/* wwEditor:start */
import './components/SettingsEdit.vue';
import './components/SettingsSummary.vue';
import './components/loadPackage.vue';
/* wwEditor:end */

export default {
    packages: {},

    async onLoad() {
        addScripts(this.settings.publicData.packages, wwLib.getFrontDocument());
    },

    // this.$nextTick(this.loadInstance);

    loadPackage({ data, fileName }, wwUtils) {
        addScript(this.settings.publicData.packages[0], wwLib.getFrontDocument());

        data = { test: 'test' };
        /* wwEditor:start */
        wwUtils && wwUtils.log({ label: 'Data', preview: data });
        /* wwEditor:end */

        console.log({ data, fileName }, wwUtils);
    },
};

function addScript(packageItem, context) {
    const packageSrc = `https://unpkg.com/${packageItem.name}@${packageItem.version}`;
    const existingScript = context.querySelector(`script[src="${packageSrc}"]`);
    if (existingScript) return;

    const script = context.createElement('script');
    script.type = 'text/javascript';
    script.src = packageSrc;
    script.onload = () => {
        packages[packageItem.name] = wwLib.getFrontWindow()[packageItem.name];
    };

    context.head.appendChild(script);
}

function addScripts(packages, context) {
    for (const packageItem of packages) {
        if (packageItem.auto) addScript(packageItem, context);
    }
}
