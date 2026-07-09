package com.rnarcgis

import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.ArcGISMapViewManagerDelegate
import com.facebook.react.viewmanagers.ArcGISMapViewManagerInterface

class ArcGISMapViewManager:
    SimpleViewManager<ArcGISMapFabricView>(),
    ArcGISMapViewManagerInterface<ArcGISMapFabricView>
{
    private val delegate = ArcGISMapViewManagerDelegate(this)
    override fun getDelegate(): ViewManagerDelegate<ArcGISMapFabricView> = delegate
    override fun getName() = "ArcGISMapView"

    override fun createViewInstance(context: ThemedReactContext): ArcGISMapFabricView {
        return ArcGISMapFabricView(context)
    }

    override fun setPinsJson(view: ArcGISMapFabricView?, value: String?) {
        view?.setPins(value)
    }

    // Event constants: map the JS event name to Fabric's native registration name.
    // Convention is "on<Name>" (JS) <-> "top<Name>" (native registration key).
    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
        return mutableMapOf(
            "toMapTap" to mutableMapOf("registrationName" to "onMapTap"),
            "toMapCenterStateChange" to mutableMapOf("registrationName" to "onMapCenterStateChange")
        )
    }

}