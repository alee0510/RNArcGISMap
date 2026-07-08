package com.rnarcgis

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import androidx.core.app.ActivityCompat
import com.facebook.fbreact.specs.NativeLocationModuleSpec
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener
import com.google.android.gms.location.CurrentLocationRequest
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority

class LocationModule(reactContext: ReactApplicationContext) : NativeLocationModuleSpec(reactContext) {

    private val focusedLocationClient = LocationServices.getFusedLocationProviderClient(reactContext)
    private var locationCallback: LocationCallback? = null

    override fun getName() = "LocationModule"

    private fun currentLocationGranularity(): String {
        val ctx = reactApplicationContext
        val fine = ActivityCompat.checkSelfPermission(ctx, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
        val coarse = ActivityCompat.checkSelfPermission(ctx, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
        return when {
            fine -> "fine"
            coarse -> "coarse"
            else -> "denied"
        }
    }

    override fun checkLocationPermission(promise: Promise?) {
        promise?.resolve(currentLocationGranularity())
    }

    override fun requestLocationPermission(promise: Promise?) {
        val activity = reactApplicationContext.currentActivity
        if (activity !is PermissionAwareActivity) {
            promise?.reject("E_ACTIVITY_NOT_FOUND", "Current activity is not a PermissionAwareActivity")
            return
        }

        val currentPermission = currentLocationGranularity()
        if (currentPermission != "denied") {
            promise?.resolve(currentPermission)
            return
        }

        val listener = PermissionListener { requestCode, _, _ ->
            if (requestCode == LOCATION_PERMISSION_REQUEST_CODE) {
                promise?.resolve(currentLocationGranularity())
                true
            } else false
        }


        activity.requestPermissions(
            arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION),
            LOCATION_PERMISSION_REQUEST_CODE,
            listener
        )
    }

    @SuppressLint("MissingPermission")
    override fun getCurrentLocation(promise: Promise?) {
        val currentPermission = currentLocationGranularity()
        if (currentPermission == "denied") {
            promise?.reject("PERMISSION_DENIED", "Location permission not granted")
            return
        }

        val request = CurrentLocationRequest.Builder()
            .setPriority(
                if(currentPermission == "fine") Priority.PRIORITY_HIGH_ACCURACY
                else Priority.PRIORITY_BALANCED_POWER_ACCURACY
            )
            .build()

        focusedLocationClient.getCurrentLocation(request, null)
            .addOnSuccessListener { location ->
                if (location == null) {
                    promise?.reject("E_LOCATION_NOT_FOUND", "Unable to retrieve location")
                } else {
                    val result = Arguments.createMap().apply {
                        putDouble("latitude", location.latitude)
                        putDouble("longitude", location.longitude)
                        putDouble("accuracy", location.accuracy.toDouble())
                    }
                    promise?.resolve(result)
                }
            }
            .addOnFailureListener { exception ->
                promise?.reject("E_LOCATION_ERROR", exception.message)
            }
    }

    override fun startLocationUpdates(intervalInMs: Double, promise: Promise?) {
        val request = LocationRequest.Builder(intervalInMs.toLong())
            .setPriority(Priority.PRIORITY_HIGH_ACCURACY)
            .build()

        locationCallback = object : LocationCallback() {
            override fun onLocationResult(p0: LocationResult) {
                val location = p0.lastLocation ?: return
                emitLocationUpdate(location.latitude, location.longitude, location.accuracy)
            }
        }

        try {
            focusedLocationClient.requestLocationUpdates(
                request,
                locationCallback as LocationCallback,
                reactApplicationContext.mainLooper
            )
            promise?.resolve(null)
        }
        catch (e: SecurityException) {
            promise?.reject("PERMISSION_ERROR", "Location permission not granted", e)
        }
    }

    private fun emitLocationUpdate(lat: Double, long: Double, accuracy: Float) {
        val params = Arguments.createMap().apply {
            putDouble("latitude", lat)
            putDouble("longitude", long)
            putDouble("accuracy", accuracy.toDouble())
        }
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onLocationUpdate", params)
    }

    override fun stopLocationUpdates(promise: Promise?) {
        locationCallback?.let { focusedLocationClient.removeLocationUpdates { it } }
        locationCallback = null
        promise?.resolve(null)
    }

    override fun addListener(eventName: String?, callback: Callback?) {}

    override fun removeListener(eventName: String?) {}

    companion object {
        const val NAME = "LocationModule"
        const val LOCATION_PERMISSION_REQUEST_CODE = 1001
    }
}