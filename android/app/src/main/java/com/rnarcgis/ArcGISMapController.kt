package com.rnarcgis

import android.graphics.drawable.BitmapDrawable
import androidx.compose.runtime.mutableStateOf
import androidx.core.content.ContextCompat
import androidx.core.graphics.drawable.toBitmap
import com.arcgismaps.ArcGISEnvironment
import com.arcgismaps.Color
import com.arcgismaps.geometry.Point
import com.arcgismaps.geometry.SpatialReference
import com.arcgismaps.mapping.ArcGISMap
import com.arcgismaps.mapping.BasemapStyle
import com.arcgismaps.mapping.symbology.PictureMarkerSymbol
import com.arcgismaps.mapping.symbology.SimpleLineSymbol
import com.arcgismaps.mapping.symbology.SimpleLineSymbolStyle
import com.arcgismaps.mapping.symbology.SimpleMarkerSymbol
import com.arcgismaps.mapping.symbology.SimpleMarkerSymbolStyle
import com.arcgismaps.mapping.view.Graphic
import com.arcgismaps.mapping.view.GraphicsOverlay
import com.arcgismaps.tasks.networkanalysis.Route

object ArcGISMapController {
    val basemapStyleState = mutableStateOf<BasemapStyle>(BasemapStyle.ArcGISTopographicBase)
    val map = mutableStateOf(ArcGISMap(basemapStyleState.value))


    val routeOverlay = GraphicsOverlay()
    val pinsOverlay = GraphicsOverlay()
    val overlays = listOf(pinsOverlay, routeOverlay)

    private val outlineMarker by lazy {
        SimpleLineSymbol(SimpleLineSymbolStyle.Solid, Color.red, 5f)
    }

    fun setBasemapStyle(style: BasemapStyle) {
        basemapStyleState.value = style
        map.value = ArcGISMap(style) // recreate map; view observes map.value and recomposes

    }

    fun setPins(pins: List<PinData>) {
        pinsOverlay.graphics.removeAll { it.attributes["type"] == "pin" }
        val context = ArcGISEnvironment.applicationContext ?: return
        val markerDrawable = ContextCompat.getDrawable(context, R.drawable.push)
        val markerSymbol = PictureMarkerSymbol.createWithImage(BitmapDrawable(context.resources, markerDrawable?.toBitmap())).apply {
            width = 35f
            height = 35f
        }

        pins.forEach { pin ->
            val point = Point(pin.long, pin.lat, SpatialReference.wgs84())
            val graphic = Graphic(point, markerSymbol)
            graphic.attributes["type"] = "pin"
            graphic.attributes["id"] = pin.id
            pinsOverlay.graphics.add(graphic)
        }
    }

    fun setRoute(startPoint: Point, endPoint: Point, route: Route) {
        routeOverlay.graphics.removeAll { it.attributes["type"] == "route" }

        val startSymbol = SimpleMarkerSymbol(SimpleMarkerSymbolStyle.Circle, Color.blue, 20f)
        startSymbol.outline = SimpleLineSymbol(SimpleLineSymbolStyle.Solid, Color.fromRgba(240, 240, 240, 200), 5f)
        val startGraphic = Graphic(startPoint, startSymbol)
        startGraphic.attributes["type"] = "route"

        val context = ArcGISEnvironment.applicationContext ?: return
        val endDrawable = ContextCompat.getDrawable(context,R.drawable.flag)
        val endSymbol = PictureMarkerSymbol.createWithImage(BitmapDrawable(context.resources, endDrawable?.toBitmap())).apply {
            width = 35f
            height = 35f
            offsetY = 10f
            offsetX = -10f
        }
        val endGraphic = Graphic(endPoint, endSymbol)
        endGraphic.attributes["type"] = "route"

        val lineSymbol = SimpleLineSymbol(SimpleLineSymbolStyle.Solid, Color.blue, 6f)
        val routeGraphic = Graphic(route.routeGeometry, lineSymbol)
        routeGraphic.attributes["type"] = "route"

        routeOverlay.graphics.addAll(listOf(
            routeGraphic,
            startGraphic,
            endGraphic
        ))
    }

    fun clearRoute() {
        routeOverlay.graphics.removeAll { it.attributes["type"] == "route" }
    }
}