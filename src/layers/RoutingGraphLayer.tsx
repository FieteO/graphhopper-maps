import React, { useState } from 'react'
import { Layer, Popup, Source } from 'react-map-gl'
import { MapLayer } from '@/layers/MapLayer'

export default function (enabled: boolean): MapLayer {
    const [currRoad, setCurrRoad] = useState<any>(null)
    return {
        interactiveLayerIds: ['gh-graph'],
        onClick: () => {},
        onHover: feature => {
            setCurrRoad(feature)
        },
        layer: (
            <>
                {currRoad && enabled && (
                    <Popup longitude={currRoad.lngLat[0]} latitude={currRoad.lngLat[1]}>
                        <pre>{JSON.stringify(currRoad.feature.properties, null, 2)}</pre>
                    </Popup>
                )}
                {enabled && (
                    <Source type={'vector'} tiles={['http://localhost:8989/mvt/{z}/{x}/{y}.mvt?details=road_class']}>
                        <Layer
                            id="gh-graph"
                            type="line"
                            source-layer="roads"
                            paint={{
                                'line-color': [
                                    'match',
                                    ['get', 'road_class'],
                                    'motorway',
                                    'red',
                                    'primary',
                                    'orange',
                                    'trunk',
                                    'orange',
                                    'secondary',
                                    'yellow',
                                    /*other*/ 'grey',
                                ],
                                'line-width': 3,
                            }}
                            layout={{
                                'line-join': 'round',
                                'line-cap': 'round',
                            }}
                        />
                    </Source>
                )}
            </>
        ),
    }
}
