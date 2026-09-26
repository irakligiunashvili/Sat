import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'to.home.sat',
  appName: 'Sat',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
  },
}

export default config
