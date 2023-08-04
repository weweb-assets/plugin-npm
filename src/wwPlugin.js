/* wwEditor:start */
import './components/SettingsEdit.vue';
import './components/SettingsSummary.vue';
import './components/loadPackage.vue';
/* wwEditor:end */

export default {
    packages: {},

    async onLoad() {
        for (const packageItem of this.settings.publicData.packages || []) {
            console.log('packageItem', packageItem);
            const packageSrc = `https://unpkg.com/${packageItem.name}@${packageItem.version}`;
            const scriptFront = wwLib.getFrontDocument().createElement('script');
            scriptFront.type = 'text/javascript';
            scriptFront.src = packageSrc;
            scriptFront.onload = () => {
                packages['packageItem.name'] = wwLib.getFrontWindow()[packageItem.name];
            };
            wwLib.getFrontDocument().head.appendChild(scriptFront);
            /* wwEditor:start */
            const scriptEditor = wwLib.getEditorDocument().createElement('script');
            scriptEditor.type = 'text/javascript';
            scriptEditor.src = packageSrc;
            wwLib.getEditorDocument().head.appendChild(scriptEditor);
            scriptEditor.onload = () => {
                packages['packageItem.name'] = wwLib.getEditorWindow()[packageItem.name];
            };
            /* wwEditor:end */
        }

        console.log('onload', this.packages);
    },

    // this.$nextTick(this.loadInstance);

    loadPackage({ data, fileName }, wwUtils) {
        data = { test: 'test' };
        /* wwEditor:start */
        wwUtils && wwUtils.log({ label: 'Data', preview: data });
        /* wwEditor:end */

        console.log({ data, fileName }, wwUtils);
    },
};
