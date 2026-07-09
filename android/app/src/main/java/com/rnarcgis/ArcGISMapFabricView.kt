package com.rnarcgis

import android.content.Context
import android.util.AttributeSet
import android.util.Log
import android.widget.FrameLayout
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.ComposeView
import com.arcgismaps.toolkit.geoviewcompose.MapView
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import org.json.JSONArray
import org.json.JSONException

class ArcGISMapFabricView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : FrameLayout(context, attrs, defStyleAttr) {

    init {
        val composeView = ComposeView(context).apply {
            setContent {
                val map by ArcGISMapController.map
                val isCentered by ArcGISMapController.isCenteredOnUser

                LaunchedEffect(Unit) {
                    ArcGISMapController.onMapReady()
                }

                LaunchedEffect(isCentered) {
                    emitCenterStateEvent(isCentered)
                }

                MapView(
                    modifier = Modifier,
                    arcGISMap = map,
                    graphicsOverlays = ArcGISMapController.overlays,
                    mapViewProxy = ArcGISMapController.mapViewProxy,
                    onSingleTapConfirmed = { event ->
                        val mapPoint = event.mapPoint ?: return@MapView
                        emitTapEvent(mapPoint.y, mapPoint.x)
                    },
                    onViewpointChangedForCenterAndScale = { viewpoint ->
                        ArcGISMapController.onCameraMoved(viewpoint)
                    }
                )
            }
        }
        addView(composeView)
    }

    fun updateViewpoint(lat: Double? = null, long: Double? = null, scale: Double? = null) {
        ArcGISMapController.setViewPoint(lat, long, scale)
    }

    fun setPins(json: String?) {
        val parsed = mutableListOf<PinData>()
        if (!json.isNullOrEmpty()) {
            try {
                val arr = JSONArray(json)
                for (i in 0 until arr.length()) {
                    val obj = arr.getJSONObject(i)
                    parsed.add(PinData(
                        id = obj.getString("id"),
                        lat = obj.getDouble("lat"),
                        long = obj.getDouble("long")
                    ))
                }
            } catch (e: JSONException) {
                Log.e("ArcGISMapFabricView", "Failed to parse pins JSON: $json", e)
            }
        }
        ArcGISMapController.setPins(parsed)
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

    fun emitCenterStateEvent(isCentered: Boolean) {
        val reactContext = context as ThemedReactContext
        val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
        val event = MapCenterStateEvent(surfaceId, id).apply {
            this.isCentered = isCentered
        }
        UIManagerHelper.getEventDispatcher(reactContext)?.dispatchEvent(event)
    }
}