/* wwEditor:start */
import './components/SettingsEdit.vue';
import './components/SettingsSummary.vue';
import './components/loadPackage.vue';
/* wwEditor:end */

export default {
    async onLoad() {
        this.addScripts(this.settings.publicData.packages);
    },

    loadPackage() {
        this.addScript(this.settings.publicData.packages[0]);
    },

    async addScript(packageItem) {
        const packageSrc = `https://unpkg.com/${packageItem.name}@${packageItem.version}`;

        const response = await fetch(packageSrc);
        const scriptText = await response.text();

        const scriptFunction = new Function(scriptText);
        const libraryInstance = scriptFunction();

        console.log(`${this.id}-${packageItem.name}`, libraryInstance);
        wwLib.wwVariable.updateValue(`${this.id}-${packageItem.name}`, libraryInstance);
    },

    async addScripts(packages) {
        await Promise.all(packages.map(packageItem => this.addScript(packageItem)));
    },
};
