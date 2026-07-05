package com.rnarcgis

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
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