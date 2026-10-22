declare global {
    interface SettingConfig {
        'foundry-getting-lost.results-show-divisions': boolean;
    }
}

class Settings {
    #SETTINGS_ID = 'foundry-getting-lost' as const;

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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- legacy: see CLAUDE.md "Known legacy patterns"
            // @ts-ignore
            setting,
        );
    }

    /**
     * @public
     */
    init() {
        this.registerSetting('results-show-divisions', {
            name: 'Show divisions in results',
            hint: 'In result pages, divisions will be active by default',
            scope: 'world',
            config: true,
            type: Boolean,
            default: true,
        });
    }

    getValue(key: ClientSettings.Key) {
        return game.settings!.get(this.#SETTINGS_ID, key);
    }

    setValue(key: ClientSettings.Key, value: unknown) {
        return game.settings!.set(this.#SETTINGS_ID, key, value);
    }
}

export default new Settings();
