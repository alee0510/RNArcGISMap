package com.rnarcgis

import android.content.Context
import android.util.AttributeSet
import android.widget.FrameLayout
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableDoubleStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.ComposeView
import com.arcgismaps.mapping.Viewpoint
import com.arcgismaps.toolkit.geoviewcompose.MapView
import com.arcgismaps.toolkit.geoviewcompose.MapViewProxy
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event

class MapTapEvent(surfaceId: Int, viewTag: Int) : Event<MapTapEvent>(surfaceId, viewTag) {
    var latitude: Double = 0.0
    var longitude: Double = 0.0

    override fun getEventName() = "onMapTap"

    override fun getEventData(): WritableMap = Arguments.createMap().apply {
        putDouble("latitude", latitude)
        putDouble("longitude", longitude)
    }
}

class ArcGISMapFabricView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : FrameLayout(context, attrs, defStyleAttr) {
    private val latState = mutableDoubleStateOf(34.0)
    private val longState = mutableDoubleStateOf(-118.0)
    private val scaleState = mutableDoubleStateOf(72000.0)

    init {
        val composeView = ComposeView(context).apply {
            setContent {
                val mapViewPoxy = remember { MapViewProxy() }
                val map by ArcGISMapController.map

                LaunchedEffect(latState.doubleValue, longState.doubleValue, scaleState.doubleValue) {
                    mapViewPoxy.setViewpoint(Viewpoint(
                        latitude = latState.doubleValue,
                        longitude = longState.doubleValue,
                        scale = scaleState.doubleValue
                    ))
                }


                MapView(
                    modifier = Modifier,
                    arcGISMap = map,
                    graphicsOverlays = ArcGISMapController.overlays,
                    mapViewProxy = mapViewPoxy,
                    onSingleTapConfirmed = { event ->
                        val mapPoint = event.mapPoint ?: return@MapView
                        emitTapEvent(mapPoint.y, mapPoint.x)
                    }
                )
            }
        }
        addView(composeView)
    }

    fun updateViewpoint(lat: Double? = null, long: Double? = null, scale: Double? = null) {
        lat?.let { latState.doubleValue = it }
        long?.let { longState.doubleValue = it }
        scale?.let { scaleState.doubleValue = it }
    }

    fun setPins(json: String?) {
        // graphicsOverlay.graphics.clear()
        // parse JSON -> Point, add PictureMarkerSymbol / SimpleMarkerSymbol graphics
    }

    fun setRoute(json: String?) {
        // graphicsOverlay.graphics.removeAll { it.attributes["type"] == "route" }
        // parse polyline JSON -> Graphic(polyline, SimpleLineSymbol) with attributes["type"]="route"
    }

    fun emitTapEvent(lat: Double, long: Double) {
        val reactContext = context as ThemedReactContext
        val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
        val event = MapTapEvent(surfaceId, id).apply {
            latitude = lat
            longitude = long
        }
        UIManagerHelper.getEventDispatcher(reactContext)?.dispatchEvent(event)
    }
}