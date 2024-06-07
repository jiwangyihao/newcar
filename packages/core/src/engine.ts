import CanvasKitInit, { type CanvasKit } from 'canvaskit-wasm'
import { defineCreateAppApi } from './app'

export async function initEngine(wasm: string) {
  const ck = await CanvasKitInit({
    locateFile: (_file: string) => wasm,
  })

  const createApp = defineCreateAppApi(ck) as ReturnType<typeof defineCreateAppApi>

  function use<T>(builder: (ck: CanvasKit) => T) {
    return builder(ck)
  }

  return {
    createApp,
    ck,
    use,
  }
}
