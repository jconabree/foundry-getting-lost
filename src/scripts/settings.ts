declare global {
    interface SettingConfig {
        'foundry-getting-lost.your-config': string;
    }
}

class Settings {
    #SETTINGS_ID: 'foundry-getting-lost' = 'foundry-getting-lost';

    /**
     * 
     * @param {string} configName 
     * @param {SettingsConfig} setting
     * @public 
     */
    registerSetting(configName: ClientSettings.Key, setting: unknown) {
        game.settings!.register(
            this.#SETTINGS_ID,
            configName,
            // @ts-ignore
            setting
        );
    }

    /**
     * @public
     */
    init() {
        // this.registerSetting(
        //     'your-config',
        //     {
        //         name: 'Your Config Name',
        //         scope: 'world',
        //         config: true,
        //         type: Boolean,
        //         default: false
        //     }
        // );
    }

    getValue(key: ClientSettings.Key) {
        return game.settings!.get(this.#SETTINGS_ID, key);
    }

    setValue(key: ClientSettings.Key, value: unknown) {
        return game.settings!.set(this.#SETTINGS_ID, key, value);
    }
}

export default new Settings();