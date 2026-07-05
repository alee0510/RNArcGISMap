package com.rnarcgis

import androidx.compose.runtime.mutableStateOf
import com.arcgismaps.mapping.ArcGISMap
import com.arcgismaps.mapping.BasemapStyle
import com.arcgismaps.mapping.view.GraphicsOverlay

object ArcGISMapController {
    val basemapStyleState = mutableStateOf<BasemapStyle>(BasemapStyle.ArcGISTopographicBase)
    val map = mutableStateOf(ArcGISMap(basemapStyleState.value))

    val routeOverlay = GraphicsOverlay()
    val pinsOverlay = GraphicsOverlay()
    val overlays = listOf(pinsOverlay, routeOverlay)

    fun setBasemapStyle(style: BasemapStyle) {
        basemapStyleState.value = style
        map.value = ArcGISMap(style) // recreate map; view observes map.value and recomposes

    }
}