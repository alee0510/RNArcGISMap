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

    override fun setLatitude(view: ArcGISMapFabricView, lat: Double) {
        view.updateViewpoint(lat = lat)
    }

    override fun setLongitude(view: ArcGISMapFabricView, long: Double) {
        view.updateViewpoint(long = long)
    }

    override fun setPinsJson(view: ArcGISMapFabricView?, value: String?) {
        view?.setPins(value)
    }

    override fun setRouteGeometryJson(view: ArcGISMapFabricView?, value: String?) {
        view?.setRoute(value)
    }

    override fun setZoomScale(view: ArcGISMapFabricView?, value: Double) {
        view?.updateViewpoint(scale = value)
    }

    // Event constants: map the JS event name to Fabric's native registration name.
    // Convention is "on<Name>" (JS) <-> "top<Name>" (native registration key).
    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
        return mutableMapOf(
            "toMapTap" to mutableMapOf("registrationName" to "onMapTap")
        )
    }

}