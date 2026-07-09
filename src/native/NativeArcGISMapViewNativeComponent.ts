import { codegenNativeComponent } from 'react-native';
import type { HostComponent, ViewProps } from 'react-native';
import type { Double, DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';

interface MapTapEven {
    latitude: Double,
    longitude: Double,
}

interface MapCenterStateEvent {
    isCentered: boolean;
}

export interface NativeProps extends ViewProps {
    pinsJson?: string; // serialized array of {lat, long, id}
    onMapTap?: DirectEventHandler<MapTapEven>;
    onMapCenterStateChange?: DirectEventHandler<MapCenterStateEvent>
}

export default codegenNativeComponent<NativeProps>("ArcGISMapView") as HostComponent<NativeProps>;
