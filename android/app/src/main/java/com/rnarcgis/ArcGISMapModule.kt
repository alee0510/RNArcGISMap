package com.rnarcgis

import com.arcgismaps.geometry.Point
import com.arcgismaps.geometry.SpatialReference
import com.arcgismaps.mapping.BasemapStyle
import com.arcgismaps.tasks.networkanalysis.RouteTask
import com.arcgismaps.tasks.networkanalysis.Stop
import com.facebook.fbreact.specs.NativeArcGISMapModuleSpec
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject


class ArcGISMapModule (reactContext: ReactApplicationContext): NativeArcGISMapModuleSpec(reactContext)  {

    override fun getName() = "ArcGISMapModule"
    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    override fun setBaseMapStyle(styleName: String?, promise: Promise?) {
        val style = when (styleName) {
            "ARCGIS_STREETS" -> BasemapStyle.ArcGISStreets
            "ARCGIS_IMAGERY" -> BasemapStyle.ArcGISImagery
            "ARCGIS_NAVIGATION_NIGHT" -> BasemapStyle.ArcGISNavigationNight
            "ARCGIS_TOPOGRAPHIC" -> BasemapStyle.ArcGISTopographicBase
            else -> {
                promise?.reject("INVALID_STYLE", "Unknown Basemap style: $styleName")
                return
            }
        }
        ArcGISMapController.setBasemapStyle(style)
        promise?.resolve(styleName)
    }

    // routeGeoJson = [startLat, startLong, endLat, endLong]
    override fun computeRoute(routeGeoJson: String?, promise: Promise?) {
        if (routeGeoJson.isNullOrEmpty()) {
            promise?.reject("ROUTE_ERROR", "routeGeoJson is null or empty")
            return
        }

        scope.launch {
            try {
                val parsed = JSONArray(routeGeoJson)
                val routeGeoData = RouteGeoData(
                    startLat = parsed.getDouble(0),
                    startLong = parsed.getDouble(1),
                    endLat = parsed.getDouble(2),
                    endLong = parsed.getDouble(3)
                )

                val startPoint = Point(
                    routeGeoData.startLong,
                    routeGeoData.startLat,
                    SpatialReference.wgs84()
                )

                val endPoint = Point(
                    routeGeoData.endLong,
                    routeGeoData.endLat,
                    SpatialReference.wgs84()
                )

                val solveResult = withContext(Dispatchers.IO) {
                    val routeTask = RouteTask(
                        "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World"
                    )
                    val parameters = routeTask.createDefaultParameters().getOrThrow().apply {
                        setStops(listOf(
                            Stop(startPoint),
                            Stop(endPoint)
                        ))
                        returnDirections = true
                    }
                    routeTask.solveRoute(parameters).getOrThrow()
                }

                val route = solveResult.routes.first()
                val jsonObject = JSONObject().apply {
                    put("geometry", route.routeGeometry?.toJson()?.let { JSONObject(it) })
                    
                    val directionsArray = JSONArray().apply {
                        route.directionManeuvers.forEach { maneuver ->
                            put(maneuver.directionText)
                        }
                    }
                    put("directions", directionsArray)
                    put("totalDistance", route.totalLength)
                    put("totalTime", route.totalTime)
                }

                ArcGISMapController.setRoute(startPoint, endPoint, route)
                promise?.resolve(jsonObject.toString())
            } catch (e: Exception) {
                promise?.reject("ROUTE_ERROR", e.message, e)
            }
        }
    }

    override fun clearRoute(promise: Promise?) {
        scope.launch {
            ArcGISMapController.clearRoute()
            promise?.resolve(null)
        }
    }

    override fun recenterMap(lat: Double, lng: Double, scale: Double, promise: Promise?) {
        ArcGISMapController.setViewPoint(lat, lng, scale, true)
        promise?.resolve(null)
    }

    override fun setUserLocation(
        latitude: Double,
        longitude: Double,
        recenter: Boolean,
        promise: Promise?
    ) {
        val point = Point(longitude, latitude, SpatialReference.wgs84())
        ArcGISMapController.setCurrentLocation(point, recenter)
        promise?.resolve(null)
    }

    override fun recenterToCurrentLocation(promise: Promise?) {
        ArcGISMapController.recenterToCurrentLocation()
        promise?.resolve(null)
    }

    override fun zoomIn(promise: Promise?) {
        ArcGISMapController.zoomIn()
        promise?.resolve(null)
    }

    override fun zoomOut(promise: Promise?) {
        ArcGISMapController.zoomOut()
        promise?.resolve(null)
    }

    companion object {
        const val NAME = "ArcGISMapModule"
    }
}