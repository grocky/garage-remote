## garage remote

A nodejs server to open my garage from my couch.

[setup](./raspberry-pi-setup.md)

Static ip: http://192.168.1.10

## application setup

1. clone the repo onto the pi (todo: make deployment config)
2. install pm2: `sudo npm i -g pm2`
3. `sudo setcap 'cap_net_bind_service=+ep' $(which node)`
3. add pm2 startup config
    ```
    sudo env PATH=$PATH:/usr/local/bin pm2 startup systemd -u pi --hp /home/pi
    ```
4. `cd garage-remote && npm run build`
5. `cd server && npm install && pm2 start ecosystem.config.js --env production`
