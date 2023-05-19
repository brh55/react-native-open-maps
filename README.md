# react-native-open-maps
[![build status](https://img.shields.io/travis/com/brh55/react-native-open-maps/main?style=flat-square)](https://app.travis-ci.com/github/brh55/react-native-open-maps)
[![coverage](https://img.shields.io/coveralls/github/brh55/react-native-open-maps?style=flat-square)](https://coveralls.io/github/brh55/react-native-open-maps)
[![npm](https://img.shields.io/npm/dt/react-native-open-maps.svg?style=flat-square)](https://www.npmjs.com/package/react-native-open-maps)

> 🗺 A simple cross-platform library to help perform map actions to the corresponding device's map (Google, Apple, or Yandex Maps)

`react-native-open-maps` works by creating a universal map link for either Apple, Google, and Yandex maps that can be used to open up the relevant map application. In order to maximize compatibility some platform specific parameters are omitted, but simplifies development efforts and ensures a smooth user experience.

**Features**
- ✅ Open the map coordinates immediately
- ✅ Create a delayed invoked `function` that will open the map
- ✅ Create a `string` of the map link
- ✅ Cross-compatible properties among different map applications

![New Demo Preview](http://g.recordit.co/0IPl516Adc.gif)

## Usage
1. Install the repository
    ```bash
    $ npm install --save react-native-open-maps
    ```
2. Add an import to the top of your file
    ```js
    import openMap from 'react-native-open-maps';
    ```
3. Put it all together
    ```js
    import React, { Component } from 'react';
    import { Button } from 'react-native';
    import openMap from 'react-native-open-maps';

    export default class App extends Component {
      _goToYosemite() {
        openMap({ latitude: 37.865101, longitude: -119.538330 });
      }

      render() {
        return (
          <Button
            color={'#bdc3c7'}
            onPress={this._goToYosemite}
            title="Click To Open Maps 🗺" />
        );
      }
    }
    ```
4. **BONUS:** You can also create delayed functions for more of that `1 - 1` mapping flavor 🍦.
```js
import { createOpenLink } from 'react-native-open-maps';

const yosemite = { latitude: 37.865101, longitude: -119.538330 };
const openYosemite = createOpenLink(yosemite);
const openYosemiteZoomedOut = createOpenLink({ ...yosemite, zoom: 30 });

const facebookHQ = { latitude: 37.4847, longitude: 122.1477 };
const openFacebookHQ = createOpenLink(facebookHQ);

// Condensed for Readability...
    render() {
        return (
          <Button
            color={'#bdc3c7'}
            onPress={openYosemite}
            title="Go to Yosemite 🏔" />
          <Button
            color={'#bdc3c7'}
            onPress={openFacebookHQ}
            title="Go to Facebook HQ 🕋" />
        );
```

If you need additional examples, view the example directory for a demo you can run locally.

## API
#### default function `open(options)`
`react-native-open-maps` immediately opens the map of the coordinates and the settings

#### `{ createOpenLink(options) }`
Creates a delayed invoked function to open the map. This is useful for binding functions to `onPress()` in a succinct manner. Think of it like ... `function openToMe() { open(coordinates) }`

#### `{ createMapLink(options) }`
Creates the raw link for the map.

#### `{ createQueryParameters(options) }`
Creates the query parameters for the designated maps provider. Useful if you want to override the base url and perform logic to override it with a native base URL.

#### options
| Properties   | Type                                                   | Description                                                  | Example                         | Map Support |
| ------------ | ------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------- | ----------- |
| *latitude*   | `number`                                               | The latitude                                                 | 37.865101                       | All         |
| *longitude*  | `number`                                               | The longitude                                                | -119.538330                     | All         |
| *zoom*       | `number`                                               | The zoom level, only works with `latitude` and `longitude`   | 18 <br> *Default: 15*           | All         |
| *provider*   | `string` <br> [`google`,`apple`,`yandex`]                       | If no provider set, it will determine according to `Platform.OS` | `apple`                         | N/A         |
| *query*      | `string`                                               | Will act according to the map used. Refer to [query property](#query-property) | `"Yosemite Trail"`              | All         |
| *queryPlaceId* | `string`                                               | Will query by Place ID.                                      | `ChIJgUbEo8cfqokR5lP9_Wh_DaM`   | Google      |
| *travelType* | `enumeration` : [`drive`, `walk`,`public_transport`]   | Use this parameter in conjunction with `start` and `end` to determine transportation type. Default is `drive` | `"drive"`                       | All         |
| *start*      | `string` that geolocation can understand               | The start location that can be interpreted as a geolocation, omit if you want to use current location / "My Location". See [Apple](https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html#//apple_ref/doc/uid/TP40007899-CH5-SW1), [Google](https://developers.google.com/maps/documentation/urls/guide#directions-action) and [Yandex](https://yandex.com/dev/yandex-apps-launch/maps/doc/concepts/yandexmaps-web.html#yandexmaps-web__buildroute) docs for more details on how to define geolocations. | `"New York City, New York, NY"` | All         |
| *end*        | `string` that geolocation can understand.              | The end location that can be interpreted as a geolocation. See [Apple](https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html#//apple_ref/doc/uid/TP40007899-CH5-SW1), [Google](https://developers.google.com/maps/documentation/urls/guide#directions-action) and [Yandex](https://yandex.com/dev/yandex-apps-launch/maps/doc/concepts/yandexmaps-web.html#yandexmaps-web__buildroute) docs for more details on how to define geolocations. | `"SOHO, New York, NY"`          | All         |
| *waypoints*    | `array`: [`address`, `address`] | Define intermediate addresses between a route. | ["San Jose, California", "Campbell, California"]                        | Apple (v16+) and Google       |
| *endPlaceId* | `string`                                               | End destination with the use of a place ID that uniquely identifies a places. | `ChIJgUbEo8cfqokR5lP9_Wh_DaM`   | Google      |
| *navigate*   | `boolean`                                              | This is only specific for Google. Yandex and Apple maps will provide directions if a `start ` and `end` is provided. | `true`                          | Google      |
| *mapType*    | `enum`: [`standard`, `satellite`, `hybrid`, `transit`] | Specifies base map type. Note, `hybrid` is the satellite map with a transit layer, where as `transit` is the standard roadmap with a `transit` layer. | "hybrid"                        | All, except Yandex does not support "hybrid"        |

**Note:** 
- Combining query with latitude and longitude will override the query parameter.
- Yandex Maps does not support building routes from current location.

### Map Actions
To perform certain map actions refer these necessary parameters
- **Setting Directions**: `end`,  [ *`start `*,  *`travelType`* ]
- **Display Map Around Coordinates:** `latitude` **+** `longitude`, [ *`zoom`* ]
- **Query Map For Location:** `query`

### Examples
#### Search by query
```js
createMapLink({ provider: 'apple', query: 'Yosemite National Park' });
```

#### Search query near coordinates (lat/lng)
```js
createMapLink({ provider: 'apple', query: 'Coffee Shop', latitude: 10.02134, longitude: -29.21322 })
```

#### Get directions from start to end using addresses
```js
createMapLink({ provider: 'yandex', start: '1 Infinite Loop, Cupertino, CA', end: '1600 Amphitheatre Pkwy, Mountain View, CA' })
```

#### Get directions from here
```js
createMapLink({ provider: 'google', end: 'New York City, NY' })
```

#### Get directions from here with additional stops (Apple or Google only)
```js
createMapLink({ provider: 'google', end: 'East Brunswick, NJ' })
```

#### Get directions by walking with a hybrid view (satellite and transit)
```js
createMapLink({ provider: 'google', end: 'New York City, NY', travelType: 'walking', mapType: 'hybrid' })
```

##### Get public transit directions from start to end
```js
createMapLink({ provider: 'google', start: 'SoHo, Manhattan, New York, NY', end: 'Times Square, Manhattan, NY', travelType: 'public_transportation' })
```

##### Display with different base map options
```js
createMapLink({ provider: 'apple', query: 'hiking trails', mapType: 'satellite' })
```

##### Display centered around coordinates, really zoomed in
```js
createMapLink({ provider: 'yandex', latitude: 10.02134, longitude: -29.21322, zoom: 20 })
```

##### Query Property
The query behavior differs per platform:
- **Apple Maps**: If `latitude` and `longitude` is provided, this will place a marker with the `query` as a label. If no `latitude` or `longitude` is provided, it will center map to closest query match. This will set a **pin** with label set to the query value.
- **Google Maps**: Will override `latitude` and `longitude` if present and center map to closest query match. Without a `query`, you may however use `<latitude>,<longitude>` as a string value in the query to have a unnamed marker on the map.
- **Yandex Maps**: If `latitude` and `longitude` is provided, this will place a point to show the accurate location. If no `latitude` or `longitude` is provided, it will center map to closest query match.

## Contribute
Contributions are greatly appreciated! Prior to submitting PRs, please try to test your changes against the example application provided to make sure your changes do not break existing platforms. In addition, unit tests are recommended for new features or large changes.

### Run Changes on Example App
To test your changes against the example application.

1. `npm run example-test`
2. `cd example`
3. `npx react-native start`
4. Run on your desired simulator

Your changes should not cause unexpected behaviors or warnings.

### Run Test Suite
1. `npm test`

## License
MIT © [Brandon Him](https://github.com/brh55/react-native-open-maps)

## Shameless Plug 🔌
If you like this repository, check out my other react-native projects or follow me for other open-source projects:

- **[react-native-masonry](https://github.com/brh55/react-native-masonry)**: A pure JS react-native component to render a masonry~ish layout for images with support for dynamic columns, progressive image loading, device rotation, on-press handlers, and headers/captions.
- **[react-native-hero](https://github.com/brh55/react-native-hero)**: A super duper easy hero unit react-native component with support for dynamic image, dynamic sizing, color overlays, and more
- **[rn-component-cookbook](https://github.com/brh55/rn-component-cookbook)**: A open-source cookbook with recipes for handling everyday issues when building robust, modular react-native components
- **[generator-rnc](https://github.com/brh55/generator-rnc)**: A yeoman generator to scaffold a ready-to-go, open-source react-native component (Jest, Package dependencies, Travis, etc)
