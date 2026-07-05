import { codegenNativeComponent } from 'react-native';
import type { HostComponent, ViewProps } from 'react-native';
import type { Double, DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';

interface MapTapEven {
    latitude: Double,
    longitude: Double,
}

export interface NativeProps extends ViewProps {
    longitude?: Double;
    latitude?: Double;
    zoomScale?: Double;
    pinsJson?: string; // serialized array of {lat, lng, id}
    onMapTap?: DirectEventHandler<MapTapEven>;
}

export default codegenNativeComponent<NativeProps>("ArcGISMapView") as HostComponent<NativeProps>;
