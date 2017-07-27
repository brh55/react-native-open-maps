# react-native-open-maps
> 🗺 Open up the corresponding map application (Google or Apple Maps) from a set of coordinates (latitude &amp; longitude)

![Demo Gif](http://g.recordit.co/RhkI4WISXT.gif)

## Usage
1. Install the repository
    ```bash
    $ npm install --save react-native-open-maps
    ```
2. Add an import to the top of your file
    ```js
    import createOpenLink from 'react-native-open-maps';
    ```
3. Put it all together
    ```
    import React, { Component } from 'react';
    import { Button } from 'react-native';
    import createOpenLink from 'react-native-open-maps';

    export default class App extends Component {
      render() {
        const openToYosemite = createOpenLink({ latitude: 37.865101, longitude: -119.538330 });
        return (
          <Button
            color={'#bdc3c7'}
            onPress={openToYosemite}
            title="Click To Open Maps 🗺" />
        );
      }
    }
    ```
## API
### fn(options, open)
`react-native-open-maps` returns a delayed invoked function that can be used to execute the opening of the map.

#### options
> 🔑 *Italicize indicates optional*

| Properties | Type                              | Description                                                    | Example               |
|------------|-----------------------------------|----------------------------------------------------------------|-----------------------|
| latitude   | `number`                          | The latitude                                                   | 37.865101             |
| longitude  | `number`                          | The longitude                                                  | -119.538330           |
| *zoom*     | `number`                          | The zoom level                                                 | 18 <br> *Default: 15* |
| *provider* | `string` <br> `google` OR `apple` | Overrides the corresponding map provider with the set provider | `apple`             

#### open
**Type:** `Boolean` <br>
**Default:** `true` <br>

Open the map upon invocation, when set to `false` the default function returns the constructed map url.

## License
MIT © [Brandon Him](https://github.com/brh55/react-native-open-maps)
