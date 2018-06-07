# react-native-open-maps [![Travis](https://img.shields.io/travis/brh55/react-native-open-maps/master.svg?style=flat-square)](https://travis-ci.org/brh55/react-native-open-maps) [![David](https://img.shields.io/david/dev/brh55/react-native-open-maps.svg?style=flat-square)](https://david-dm.org/brh55/react-native-open-maps?type=dev) [![npm](https://img.shields.io/npm/dt/react-native-open-maps.svg?style=flat-square)](https://www.npmjs.com/package/react-native-open-maps)
> 🗺 Open up the corresponding device map (Google or Apple Maps) from a set of coordinates (latitude &amp; longitude)

**Features**
- ✅ Open the map coordinates immediately
- ✅ Create a delayed invoked `function` that will open the map
- ✅ Create a `string` of the map link
- ✅ Support open of Google Maps on supported iOS devices

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

> Note:
> 
> If you set provider to `google` on a `iOS` detected device, `react-native-open-maps` will check to see if it supports the Google Maps App or fallback to Apple Maps.

#### `{ createMapLink(options) }`
Creates the raw link for the map.

#### options
> 🔑 *Italicize indicates optional*

| Properties | Type                                | Description                                                    | Example               |
|------------|-------------------------------------|----------------------------------------------------------------|-----------------------|
| latitude   | `number`                            | The latitude                                                   | 37.865101             |
| longitude  | `number`                            | The longitude                                                  | -119.538330           |
| *zoom*     | `number`                            | The zoom level                                                 | 18 <br> *Default: 15* |
| *provider* | `string` <br> [`google`,`apple`,`googleDeepLink`] | Overrides the corresponding map provider with the set provider | `apple`               |
| *query*      | `string`                            | Will act according to the map used. Refer to (query property)[#query-property)] | `"Yosemite Trail"`    |

###### Query Property
Behavior based on Platform:
- `Apple Maps`: If `latitude` and `longitude` is provided, this will place a marker with the `query` as a label. If no `latitude` or `longitude` is provided, it will center map to closest query match.
- `Google Maps`: Will override `latitude` and `longitude` and center map to closest query match.


## License
MIT © [Brandon Him](https://github.com/brh55/react-native-open-maps)
