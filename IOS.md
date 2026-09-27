# Sat on iPhone

This is the primary Sat app, packaged with Capacitor for iOS and Android. The iPhone build bundles the production website, so the Mac development server is not needed. Maps, photos, search, and road routing require internet. Accounts, requests and host data are local demo data, not live bookings.

## Build

- `npm ci`
- `npm run ios:sync`
- `npm run ios:open`

In Xcode select the App scheme, your iPhone, and your Apple development team under Signing & Capabilities. Press Run. Developer Mode must be enabled on the phone. The bundle identifier is `to.home.sat`, separate from the earlier Downloads-folder demo.

To build from the command line:

```
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Debug -destination 'generic/platform=iOS' -derivedDataPath ios/build -allowProvisioningUpdates build
```

The uploaded original logo is `public/brand/sat-original.png`; the home-screen icon is a matching cream-background variant. Map content retains its own zoom gestures while page zoom is disabled.

## UI changes and verification

- Explore: full-screen map with safe-area-aware search, scrollable category chips and one expandable bottom sheet. SF-style system typography and 44-point primary controls. Tap/drag expansion no longer fires twice. Location is requested only from Locate me.
- Shop: focused modal with a scrollable body, fixed action area, system typography, safe bottom padding, Close and downward drag dismissal. Demo requests remain local.
- Signup: simple grouped choices and 16-point inputs to avoid keyboard focus zoom. Native modal focus blocks the map behind it. Signup returns to the proper profile screen.
- Host desk: neutral grouped panels, system headings, safe-area spacing and wrapping order actions.
- Reduced-motion settings disable decorative motion. Online route failures fall back to a labeled direct line; previews are not live navigation.

The legacy Downloads project is not used by these scripts. Re-run `ios:sync` after editing web files before running from Xcode.
