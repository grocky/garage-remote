const fs = require('fs');
const path = require('path');
const favicons = require('favicons');
const source = 'src/components/App/logo-red.svg';
const configuration = {
    appName: 'Garage',
    appDescription: 'Garage Remote',
    developerName: 'grocky',
    developerURL: 'https://www.rockygray.com',
    background: '#e1e1e1',
    theme_color: '#cf180a',
    path: '/',
    display: 'standalone',
    orientation: 'portrait',
    start_url: '/?utm_source=homescreen',
    version: '1.0',
    logging: false,
    online: false,
    preferOnline: false,
    icons: {
        android: true,             // Create Android homescreen icon. `boolean` or `{ offset, background, shadow }`
        appleIcon: true,           // Create Apple touch icons. `boolean` or `{ offset, background }`
        appleStartup: true,        // Create Apple startup images. `boolean` or `{ offset, background }`
        coast: false,               // Create Opera Coast icon with offset 25%. `boolean` or `{ offset, background }`
        favicons: true,             // Create regular favicons. `boolean`
        firefox: true,             // Create Firefox OS icons. `boolean` or `{ offset, background }`
        windows: false,             // Create Windows 8 tile icons. `boolean` or `{ background }`
        yandex: false               // Create Yandex browser icon. `boolean` or `{ background }`
    }
};
const callback = (error, response) => {
    if (error) {
        console.log(error.status);  // HTTP error code (e.g. `200`) or `null`
        console.log(error.name);    // Error name e.g. 'API Error'
        console.log(error.message); // Error description e.g. 'An unknown error has occurred'
        return;
    }

    const mime = require('mime-types');

    const iconList = response.images.reduce((acc, image) => {
        const isFavicon = image.name.indexOf('favicon') >= 0;

        const fullPath = (isFavicon) => {
          const iconPath = isFavicon ? '' : 'images/touch/';
          return path.join(__dirname, 'build', iconPath);
        };


        const iconDir = fullPath(isFavicon);
        if (! fs.existsSync(iconDir)) fs.mkdirSync(iconDir);

        const fileName = path.join(iconDir, image.name);
        fs.writeFileSync(fileName, image.contents);

        console.log('generating', fileName);

        const iconMeta = {
            src: fileName,
            type: mime.lookup(fileName)
        };
        return [...acc, iconMeta]
    }, []);

    // TODO: update manifest to include iconList...
};

// favicons.config = configuration;
favicons(source, configuration, callback);
