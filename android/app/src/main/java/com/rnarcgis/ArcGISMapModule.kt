package com.rnarcgis

import com.arcgismaps.mapping.BasemapStyle
import com.facebook.fbreact.specs.NativeArcGISMapModuleSpec
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob


class ArcGISMapModule (reactContext: ReactApplicationContext): NativeArcGISMapModuleSpec(reactContext)  {

    override fun getName() = "ArcGISMapModule"
    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    override fun setBaseMapStyle(styleName: String?, promise: Promise?) {
        val style = when (styleName) {
            "ARCGIS_STREETS" -> BasemapStyle.ArcGISStreets
            "ARCGIS_IMAGERY" -> BasemapStyle.ArcGISImagery
            "ARCGIS_NAVIGATION_NIGHT" -> BasemapStyle.ArcGISNavigationNight
            else -> BasemapStyle.ArcGISTopographicBase
        }
        ArcGISMapController.setBasemapStyle(style)
    }

    override fun computeRoute(params: ReadableMap?, promise: Promise?) {
        TODO("Not yet implemented")
    }

    override fun clearRoute(promise: Promise?) {
        TODO("Not yet implemented")
    }

    companion object {
        const val NAME = "ArcGISMapModule"
    }
}