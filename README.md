## garage remote

A nodejs server to open my garage from my couch.

[setup](./raspberry-pi-setup.md)

Static ip: http://192.168.1.10

## application setup

1. clone the repo onto the pi (todo: make deployment config)
2. install pm2
3. add pm2 startup config
    ```
    sudo env PATH=$PATH:/usr/local/bin pm2 startup systemd -u pi --hp /home/pi
    ```

## starting production

```
npm run build
```

This should only need to be done once on the Pi since pm2 has a restart script:

```
pm2 start ecosystem.config.js --env production
```
