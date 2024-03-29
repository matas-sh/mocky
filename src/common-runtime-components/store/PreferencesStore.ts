import { Preferences } from '../../popup/hooks/preferencesContext'
import { STORAGE_KEYS, DEFAULT_RESOURCE_TYPES, DEFAULT_URL_MATCHER_TYPE } from '../../constants'
import { StoreInterface, Store } from './Store'
import { LocalStorage } from '../storage/Storage'
import { isEqual } from 'lodash'

export default class PreferencesStore extends Store implements StoreInterface {
  preferences: Preferences | null

  constructor () {
    super(STORAGE_KEYS.PREFERENCE_SETTINGS, new LocalStorage())
    this.preferences = null
    this.store({
      resourceTypes: DEFAULT_RESOURCE_TYPES,
      urlMatching: DEFAULT_URL_MATCHER_TYPE
    })

    chrome.storage.onChanged.addListener((changes, areaName) => {
      const [key, value] = Object.entries(changes)[0]

      if (key === this.nameSpace && areaName === this.storage.getType() && !isEqual(this.preferences, value.newValue)) {
        this.preferences = value.newValue
        console.log('[PreferencesStore] on change, new preferences data: ', this.preferences)

        Object.values(this.registeredListeners).forEach((listenerCallback: Function) => {
          console.log('[PreferencesStore]: Running callback with: ', this.preferences)
          listenerCallback(this.preferences)
        })
      }
    })
  }

  async getAll (): Promise<Preferences | null> {
    if (this.initPromise != null) {
      this.preferences = await this.initPromise as unknown as Preferences
      this.initPromise = null
    }
    console.log('[PreferencesStore] getAll: ', this.preferences)
    return this.preferences
  }
}
