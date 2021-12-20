/* wwEditor:start */
import './components/SettingsEdit.vue';
import './components/SettingsSummary.vue';
/* wwEditor:end */

export default {
    async onLoad() {
        for (const packageItem of this.settings.publicData.packages || []) {
            const packageSrc = `https://unpkg.com/${packageItem.name}@${packageItem.version}`;
            const scriptFront = wwLib.getFrontDocument().createElement('script');
            scriptFront.type = 'text/javascript';
            scriptFront.src = packageSrc;
            wwLib.getFrontDocument().head.appendChild(scriptFront);
            /* wwEditor:start */
            const scriptEditor = wwLib.getEditorDocument().createElement('script');
            scriptEditor.type = 'text/javascript';
            scriptEditor.src = packageSrc;
            wwLib.getEditorDocument().head.appendChild(scriptEditor);
            /* wwEditor:end */
        }
    },
};
