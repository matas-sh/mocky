import {
  NetworkMockStore,
  PreferencesStore
} from '../../common/store'
import { Preferences } from '../../ui/hooks/preferencesContext';
import { MockData } from '../../ui/hooks/loadedMockContext';
import { formatMockedResponse, ErrorResponse } from './utils'
import { Response } from 'har-format'
import { harErrorToErrorResonMap } from './constants'
import { DEFAULT_URL_MATCHER_TYPE } from '../../common/constants'
import MockingSessionTracker from 'service-worker/mocking-session-tracker';
import FetchAPIFacade from '../common/FetchAPIFacade'
import { generateIdFromRequestObject } from '../../common/utils'

const errorBroadcast = new BroadcastChannel('error-channel')

export default class RequestResolver {
  mockStore: NetworkMockStore
  preferencesStore: PreferencesStore
  mockResponses: MockData['responses'] | undefined
  preferences: Preferences | null
  mockingSessionTracker: MockingSessionTracker

  constructor (mockingSessionTracker: MockingSessionTracker) {
    this.mockStore = new NetworkMockStore()
    this.preferencesStore = new PreferencesStore()
    this.preferences = null;
    this.mockingSessionTracker = mockingSessionTracker
  }

  async loadContext() {
    this.mockResponses = (await this.mockStore.getAll())?.responses
    this.preferences = await this.preferencesStore.getAll()
  }

  async resolveRequestWithMock (mockResponse: Response | ErrorResponse, requestId: string, debugee: chrome.debugger.Debuggee) {
    if ((mockResponse as ErrorResponse)._error !== null) {
      console.log('^ increment console log above')
      console.log('[RequestResolver] failing request with error recorded in HAR response: ', mockResponse)
      await FetchAPIFacade.failFetchRequest(debugee, requestId, harErrorToErrorResonMap[(mockResponse as ErrorResponse)._error])
      this.mockingSessionTracker.incrementMockedRequestCount()
    } else {
      console.log('^ increment console log above')
      console.log('[RequestResolver] resolving request with response recorded in HAR response: ', mockResponse)
      await FetchAPIFacade.resolveFetchRequest(debugee, formatMockedResponse({ requestId }, mockResponse))
      this.mockingSessionTracker.incrementMockedRequestCount()
    }
  }

  async continueRequest (requestId: string, debugee: chrome.debugger.Debuggee) {
    console.log('[RequestResolver] no matching response found, carrying out the request normally')
    await FetchAPIFacade.continueFetchRequest(debugee, requestId)
    this.mockingSessionTracker.incrementNonMockedRequestCount()
  }

  async handleRequest (debugee: chrome.debugger.Debuggee, method: string, params: any) {
    console.log('[RequestResolver] handleRequest: ', params)
    console.log('[RequestResolver] preferences: ', this.preferences);
    const responseId = generateIdFromRequestObject(params.request, this.preferences?.urlMatching ?? DEFAULT_URL_MATCHER_TYPE)
    const matchedResponse = this.mockResponses?.[responseId]

    if (!matchedResponse) {
      await this.continueRequest(params.requestId, debugee)
      return
    }

    if (this.preferences?.contentTypes && !(new Set(this.preferences?.contentTypes).has(matchedResponse.content.mimeType))) {
      console.log('[RequestResolver] content type: ', matchedResponse.content.mimeType, ' is not selected for mocking')
      await this.continueRequest(params.requestId, debugee)
      return
    }


    console.log('[RequestResolver] id from request object: ', { id: responseId, request: params.request, matchType: this.preferences?.urlMatching ?? DEFAULT_URL_MATCHER_TYPE} );
    

    if (matchedResponse != null) {
      try {
        this.resolveRequestWithMock(matchedResponse, params.requestId, debugee)
      } catch (e) {
        errorBroadcast.postMessage((e as Error).message)
      }
    } else {
      await this.continueRequest(params.requestId, debugee)
    }
  }
}
