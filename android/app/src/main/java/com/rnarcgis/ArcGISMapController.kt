package com.rnarcgis

import androidx.compose.runtime.mutableStateOf
import com.arcgismaps.Color
import com.arcgismaps.geometry.Point
import com.arcgismaps.geometry.SpatialReference
import com.arcgismaps.mapping.ArcGISMap
import com.arcgismaps.mapping.BasemapStyle
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
        SimpleLineSymbol(SimpleLineSymbolStyle.Solid, Color.blue, 2f)
    }

    fun setBasemapStyle(style: BasemapStyle) {
        basemapStyleState.value = style
        map.value = ArcGISMap(style) // recreate map; view observes map.value and recomposes

    }

    fun setPins(pins: List<PinData>) {
        pinsOverlay.graphics.removeAll { it.attributes["type"] == "pin" }
        val marker = SimpleMarkerSymbol(SimpleMarkerSymbolStyle.Circle, Color.red, 10f)
        marker.outline = outlineMarker

        pins.forEach { pin ->
            val point = Point(pin.long, pin.lat, SpatialReference.wgs84())
            val graphic = Graphic(point, marker)
            graphic.attributes["type"] = "pin"
            graphic.attributes["id"] = pin.id
            pinsOverlay.graphics.add(graphic)
        }
    }

    fun setRoute(route: Route) {
        routeOverlay.graphics.removeAll { it.attributes["type"] == "route" }
        val lineSymbol = SimpleLineSymbol(SimpleLineSymbolStyle.Solid, Color.green, 5f)
        val routeGraphic = Graphic(route.routeGeometry, lineSymbol)
        routeGraphic.attributes["type"] = "route"
        routeOverlay.graphics.add((routeGraphic))
    }

    fun clearRoute() {
        routeOverlay.graphics.removeAll { it.attributes["type"] == "route" }
    }
}