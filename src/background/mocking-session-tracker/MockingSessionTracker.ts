import {
  RuntimeStore,
  RuntimeData
} from '../../store'


export default class MockingSessionTracker {
  runtimeStore: RuntimeStore
  mockedRequestCount: RuntimeData['mockedRequestCount']
  nonMockedRequestCount: RuntimeData['nonMockedRequestCount']
  runtimeEventsBroadcast: BroadcastChannel
  
  constructor () {
    this.runtimeStore = new RuntimeStore()
    this.mockedRequestCount = 0
    this.nonMockedRequestCount = 0
    this.runtimeEventsBroadcast = new BroadcastChannel('runtime-events')
    this.runtimeEventsBroadcast.addEventListener('message', ({ data }: any) => {
        if (data === 'retrieve') {
            this.runtimeEventsBroadcast.postMessage({
                nonMockedRequestCount: this.nonMockedRequestCount,
                mockedRequestCount: this.mockedRequestCount
            })
        }
    })
  }

  startSession () {
    this.mockedRequestCount = 0
    this.nonMockedRequestCount = 0
    console.log('[MockingSessionTracker] reset counts')
  }

  async endSession () {
    await this.runtimeStore.overwrite({
        mockedRequestCount: this.mockedRequestCount,
        nonMockedRequestCount: this.mockedRequestCount
    })
  }

  incrementMockedRequestCount() {
    console.log('[MockingSessionTracker] increment mocked request')
    this.mockedRequestCount++
    this.runtimeEventsBroadcast.postMessage({
        mockedRequestCount: this.mockedRequestCount
    })
  }

  incrementNonMockedRequestCount() {
    console.log('[MockingSessionTracker] increment non-mocked request')
    this.nonMockedRequestCount++
    this.runtimeEventsBroadcast.postMessage({
        nonMockedRequestCount: this.nonMockedRequestCount
    })
  }
}
