import React from 'react'
import Dispatcher from '@/stores/Dispatcher'
import styles from '@/sidebar/search/Search.module.css'
import { QueryPoint, QueryPointType } from '@/stores/QueryStore'
import { AddPoint, ClearRoute, InvalidatePoint, RemovePoint, SetPoint } from '@/actions/Actions'
import RoutingProfiles from '@/sidebar/search/RoutingProfiles'
import RemoveIcon from './minus-circle-solid.svg'
import AddIcon from './plus-circle-solid.svg'
import PlainButton from '@/PlainButton'
import { RoutingProfile } from '@/api/graphhopper'
import {tr} from '@/translation/Translation'

import AddressInput from '@/sidebar/search/AddressInput'
import { MarkerComponent } from '@/map/Marker'

export default function Search({
    points,
    routingProfiles,
    selectedProfile,
    autofocus,
}: {
    points: QueryPoint[]
    routingProfiles: RoutingProfile[]
    selectedProfile: RoutingProfile
    autofocus: boolean
}) {
    points.every(point => point.isInitialized)
    return (
        <div className={styles.searchBox}>
            {points.map(point => (
                <SearchBox
                    key={point.id}
                    point={point}
                    deletable={points.length > 2}
                    onChange={() => {
                        Dispatcher.dispatch(new ClearRoute())
                        Dispatcher.dispatch(new InvalidatePoint(point))
                    }}
                    autofocus={point.type === QueryPointType.From && autofocus}
                />
            ))}
            <PlainButton
                className={styles.addSearchBox}
                aria-label={tr('add_waypoint')}
                onClick={() => Dispatcher.dispatch(new AddPoint(points.length, { lat: 0, lng: 0 }, false))}
            >
                <AddIcon />
            </PlainButton>
            <RoutingProfiles routingProfiles={routingProfiles} selectedProfile={selectedProfile} />
        </div>
    )
}

const SearchBox = ({
    point,
    onChange,
    deletable,
    autofocus,
}: {
    point: QueryPoint
    deletable: boolean
    onChange: (value: string) => void
    autofocus: boolean
}) => {
    return (
        <>
            <div className={styles.markerContainer}>
                <MarkerComponent color={point.color} />
            </div>
            <div className={styles.searchBoxInput}>
                <AddressInput
                    point={point}
                    autofocus={autofocus}
                    onCancel={() => console.log('cancel')}
                    onAddressSelected={(queryText, coordinate) =>
                        Dispatcher.dispatch(
                            coordinate
                                ? new SetPoint({
                                      ...point,
                                      isInitialized: true,
                                      queryText: queryText,
                                      coordinate: coordinate,
                                  })
                                : new SetPoint({
                                      ...point,
                                      isInitialized: false,
                                      queryText: queryText,
                                  })
                        )
                    }
                    onChange={onChange}
                />
            </div>
            {deletable && (
                <PlainButton
                    aria-label={tr('remove_waypoint')}
                    onClick={() => Dispatcher.dispatch(new RemovePoint(point))}
                    className={styles.removeSearchBox}
                >
                    <RemoveIcon />
                </PlainButton>
            )}
        </>
    )
}
