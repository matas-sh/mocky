import {
  RuntimeStore,
  RuntimeData
} from '../common/store'
import RequestInterceptor from './request-interceptor'
import RequestResolver from './request-resolver'
import MockingSessionTracker from './mocking-session-tracker'

new BroadcastChannel('wake-up-service-worker').onmessage = () => {
  console.log('[index] waking up service worker')
}

const runtimeStore = new RuntimeStore()
const mockingSessionTracker = new MockingSessionTracker()
const requestResolver = new RequestResolver(mockingSessionTracker)
const requestInterceptor = new RequestInterceptor(
  requestResolver.handleRequest.bind(requestResolver),
  () => {
    runtimeStore.overwrite({ mockingInProgress: false })
  }
)

runtimeStore.registerUpdateLister(async (newRuntimeValue: any) => {
  console.log('>>> newRuntimeValue: ', newRuntimeValue)
  if (newRuntimeValue.mockingInProgress === undefined) {
    return 
  } 

  if (newRuntimeValue.mockingInProgress) {
    await requestResolver.loadContext();
    mockingSessionTracker.startSession()
    requestInterceptor.startInterceptingOutgoingRequests()
  } else {
    requestInterceptor.stopInterceptingOutgoingRequests()
    await mockingSessionTracker.endSession()
  }
})
