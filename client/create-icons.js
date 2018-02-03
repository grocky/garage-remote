const fs = require('fs');
const favicons = require('favicons');
const source = 'src/components/App/logo-red.svg';
const configuration = {
    appName: 'garage-remote',
    appDescription: null,
    developerName: 'grocky',
    developerURL: 'https://www.rockygray.com',
    background: '#fff',
    theme_color: '#fff',
    path: '/',
    display: 'standalone',
    orientation: 'portrait',
    start_url: '/?homescreen=1',
    version: '1.0',
    logging: true,
    online: false,
    preferOnline: false,
    icons: {
        android: false,              // Create Android homescreen icon. `boolean` or `{ offset, background, shadow }`
        appleIcon: false,            // Create Apple touch icons. `boolean` or `{ offset, background }`
        appleStartup: false,         // Create Apple startup images. `boolean` or `{ offset, background }`
        coast: false,      // Create Opera Coast icon with offset 25%. `boolean` or `{ offset, background }`
        favicons: true,             // Create regular favicons. `boolean`
        firefox: false,              // Create Firefox OS icons. `boolean` or `{ offset, background }`
        windows: false,              // Create Windows 8 tile icons. `boolean` or `{ background }`
        yandex: false                // Create Yandex browser icon. `boolean` or `{ background }`
    }
};
const callback = (error, response) => {
    if (error) {
        console.log(error.status);  // HTTP error code (e.g. `200`) or `null`
        console.log(error.name);    // Error name e.g. 'API Error'
        console.log(error.message); // Error description e.g. 'An unknown error has occurred'
        return;
    }
    response.images.forEach(image => fs.writeFileSync(`public/${image.name}`, image.contents));
};

favicons(source, configuration, callback);