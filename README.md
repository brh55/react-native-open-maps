# react-native-open-maps
 [![Travis](https://img.shields.io/travis/brh55/react-native-open-maps/master.svg?style=flat-square)](https://travis-ci.org/brh55/react-native-open-maps) [![David](https://img.shields.io/david/dev/brh55/react-native-open-maps.svg?style=flat-square)](https://david-dm.org/brh55/react-native-open-maps?type=dev) [![npm](https://img.shields.io/npm/dt/react-native-open-maps.svg?style=flat-square)](https://www.npmjs.com/package/react-native-open-maps)

> 🗺 A simple cross-platform library to help perform map actions to the corresponding device's map (Google or Apple Maps)

`react-native-open-maps` works by creating a deep link for either Apple maps or Google maps that can be used to open up the relevant map application. In order to maximize compatibility some platform specific parameters are omitted, but simplifies development efforts and ensures a smooth user experience.

**Features**
- ✅ Open the map coordinates immediately
- ✅ Create a delayed invoked `function` that will open the map
- ✅ Create a `string` of the map link
- Cross-compatible properties among both map applications

![Demo Gif](http://g.recordit.co/RhkI4WISXT.gif)

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

## API
#### default function `open(options)`
`react-native-open-maps` immediately opens the map of the coordinates and the settings

#### `{ createOpenLink(options) }`
Creates a delayed invoked function to open the map. This is useful for binding functions to `onPress()` in a succinct manner. Think of it like ... `function openToMe() { open(coordinates) }`

#### `{ createMapLink(options) }`
Creates the raw link for the map.

#### options
> 🔑 *Italicize indicates optional*

| Properties | Type                                | Description                                                    | Example               |
|------------|-------------------------------------|----------------------------------------------------------------|-----------------------|
| *latitude*   | `number`                            | The latitude                                                   | 37.865101             |
| *longitude*  | `number`                            | The longitude                                                  | -119.538330           |
| *zoom*     | `number`                            | The zoom level, only works with `latitude` and `longitude`                                     | 18 <br> *Default: 15* |
| *provider* | `string` <br> [`google`,`apple`] | If no provider set, it will determine according to `Platform.OS` | `apple`               |
| *query*      | `string`                            | Will act according to the map used. Refer to [query property](#query-property) | `"Yosemite Trail"`    |
| *travelType* | `enumeration` : [`drive`, `walk`,`public_transport`] | Use this parameter in conjunction with `start` and `end` to determine transportation type. Default is `drive` | `"drive"` |
| *start* | `string` that geolocation can understand | The start location that can be interpreted as a geolocation, omit if you want to use current location / "My Location". See [Apple](https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html#//apple_ref/doc/uid/TP40007899-CH5-SW1) and [Google](https://developers.google.com/maps/documentation/urls/guide#directions-action) docs for more details on how to define geolocations. | `"New York City, New York, NY"` |
| *end* | `string` that geolocation can understand. | The end location that can be interpreted as a geolocation. See [Apple](https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html#//apple_ref/doc/uid/TP40007899-CH5-SW1) and [Google](https://developers.google.com/maps/documentation/urls/guide#directions-action) docs for more details on how to define geolocations. | `"SOHO, New York, NY"` |
| *navigate_mode* | `string` <br> [`preview`,`navigate`] | Determines whether map should open in preview mode or in navigate mode (with turn-by-turn navigation). <br> This parameter only works in conjunction with `end`. Platform map uses current location as `start` parameter | `"navigate"` <br> *default: `"preview"`* |

**Note:** Combining query with latitude and longitude will override the query parameter.

### Map Actions
To perform certain map actions refer these necessary parameters
- **Setting Directions**: `end`,  [ *`start `*,  *`travelType`* ]
- **Display Map Around Coordinates:** `latitude` **+** `longitude`, [ *`zoom`* ]
- **Query Map For Location:** `query`

##### Query Property
The query behavior differs per platform:
- **Apple Maps**: If `latitude` and `longitude` is provided, this will place a marker with the `query` as a label. If no `latitude` or `longitude` is provided, it will center map to closest query match.
- **Google Maps**: Will override `latitude` and `longitude` if present and center map to closest query match. Without a `query`, you may however use `<latitude>,<longitude>` as a string value in the query to have a unnamed marker on the map.

## License
MIT © [Brandon Him](https://github.com/brh55/react-native-open-maps)

## Shameless Plug 🔌
If you like this repository, check out my other react-native projects or follow me for other open-source projects:

- **[react-native-masonry](https://github.com/brh55/react-native-masonry)**: A pure JS react-native component to render a masonry~ish layout for images with support for dynamic columns, progressive image loading, device rotation, on-press handlers, and headers/captions.
- **[react-native-hero](https://github.com/brh55/react-native-hero)**: A super duper easy hero unit react-native component with support for dynamic image, dynamic sizing, color overlays, and more
- **[rn-component-cookbook](https://github.com/brh55/rn-component-cookbook)**: A open-source cookbook with recipes for handling everyday issues when building robust, modular react-native components
- **[generator-rnc](https://github.com/brh55/generator-rnc)**: A yeoman generator to scaffold a ready-to-go, open-source react-native component (Jest, Package dependencies, Travis, etc)
