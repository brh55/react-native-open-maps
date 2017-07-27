# react-native-open-maps [![Travis](https://img.shields.io/travis/brh55/react-native-open-maps/master.svg?style=flat-square)](https://travis-ci.org/brh55/react-native-open-maps) [![David](https://img.shields.io/david/dev/brh55/react-native-open-maps.svg?style=flat-square)](https://david-dm.org/brh55/react-native-open-maps?type=dev) [![npm](https://img.shields.io/npm/dt/react-native-open-maps.svg?style=flat-square)](https://www.npmjs.com/package/react-native-open-maps)
> 🗺 Open up the corresponding device map (Google or Apple Maps) from a set of coordinates (latitude &amp; longitude)

![Demo Gif](http://g.recordit.co/RhkI4WISXT.gif)

**Features**
- ✅ Open the map coordinates immediately
- ✅ Create a delayed invoked `function` that will open the map
- ✅ Create a `string` of the map link

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
        const openToYosemite = ;
        return (
          <Button
            color={'#bdc3c7'}
            onPress={_goToYosemite}
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
const openFacebook = createOpenLink(facebookHQ);
```

## API
#### default function `open(options)`
`react-native-open-maps` immediately opens the map of the coordinates and the settings

#### `{ createOpenLink(options) }`
Creates a delayed invoked function to open the map. Think of it like ... `function openToMe() { open(coordinates) }`

#### `{ createMapLink(options) }`
Creates the raw link for the map.

#### options
> 🔑 *Italicize indicates optional*

| Properties | Type                              | Description                                                    | Example               |
|------------|-----------------------------------|----------------------------------------------------------------|-----------------------|
| latitude   | `number`                          | The latitude                                                   | 37.865101             |
| longitude  | `number`                          | The longitude                                                  | -119.538330           |
| *zoom*     | `number`                          | The zoom level                                                 | 18 <br> *Default: 15* |
| *provider* | `string` <br> (`google` OR `apple`) | Overrides the corresponding map provider with the set provider | `apple`             

## License
MIT © [Brandon Him](https://github.com/brh55/react-native-open-maps)
