declare module 'react-native-open-maps' {
  export interface ShowOptions {
    /** The latitude, for example 37.865101 */
    latitude?: number
    /** The longitude, for example -119.538330 */
    longitude?: number
    /** The zoom level, only works with latitude and longitude, for example 18. Default is 15. */
    zoom?: number
    /** If no provider set, it will determine according to Platform.OS */
    provider?: 'google' | 'apple'
    /** Will act according to the map used. Refer to query property. Example: "Yosemite Trail" */
    query?: string
    /** Use this parameter in conjunction with start and end to determine transportation type. Default is drive "drive". */
    travelType?: 'drive' | 'walk' | 'public_transport'
    /** The start location that can be interpreted as a geolocation, omit if you want to use current location / "My Location". See Apple and Google docs for more details on how to define geolocations. "New York City, New York, NY" */
    start?: string
    /** The end location that can be interpreted as a geolocation. See Apple and Google docs for more details on how to define geolocations. Example: "SOHO, New York, NY" */
    end?: string
    /** Determines whether map should open in preview mode or in navigate mode (with turn-by-turn navigation). This parameter only works in conjunction with end. Platform map uses current location as start parameter. */
    navigate_mode?: 'preview' | 'navigate'
  }

  export function createOpenLink(options: ShowOptions): () => Promise<void>
  export function createMapLink(options: ShowOptions): string
  export default function open(options: ShowOptions): void
}
