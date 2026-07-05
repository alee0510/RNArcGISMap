package com.rnarcgis

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager

class MyPackage : BaseReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return when (name) {
            LocationModule.NAME -> LocationModule(reactContext)
            ArcGISMapModule.NAME -> ArcGISMapModule(reactContext)
            else -> null
        }
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            mapOf(
                LocationModule.NAME to ReactModuleInfo(
                    LocationModule.NAME, LocationModule.NAME,
                    false, false, false, true
                ),
                ArcGISMapModule.NAME to ReactModuleInfo(
                    ArcGISMapModule.NAME, ArcGISMapModule.NAME,
                    false, false, false, true
                )
            )
        }
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<in Nothing, in Nothing>> {
        return listOf(ArcGISMapViewManager())
    }
}