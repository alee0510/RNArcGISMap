package com.rnarcgis

import android.app.Application
import com.arcgismaps.ApiKey
import com.arcgismaps.ArcGISEnvironment
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
          add(MyPackage())
        },

    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
    val apiKey = BuildConfig.ARCGIS_API_KEY
    ArcGISEnvironment.applicationContext = applicationContext
    if (apiKey.isNotEmpty()) {
      ArcGISEnvironment.apiKey = ApiKey.create(apiKey)
    }
  }
}
