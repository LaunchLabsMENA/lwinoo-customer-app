import UIKit
import GoogleMaps

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    if let key = Bundle.main.object(forInfoDictionaryKey: "GMSApiKey") as? String, !key.isEmpty {
      if key.hasPrefix("YOUR_") {
        // The map renders blank (Google logo only) until a real key is set in Info.plist.
        NSLog("[LWINOO] GMSApiKey in Info.plist is still a placeholder; Google Maps will not load tiles.")
      }
      GMSServices.provideAPIKey(key)
    }
    return true
  }
}
