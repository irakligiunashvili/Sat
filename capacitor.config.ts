import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'to.home.sat',
  appName: 'Sat',
  webDir: 'dist',
  ios: { contentInset: 'never', preferredContentMode: 'mobile', zoomEnabled: false, backgroundColor: '#f7f7f2', appendUserAgent: 'Sat/0.1' },
  android: {
    allowMixedContent: false,
  },
}

export default config
