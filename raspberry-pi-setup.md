[steps found here](https://www.raspberrypi.org/documentation/installation/installing-images/mac.md)

Download the image from [here](https://www.raspberrypi.org/downloads/raspbian/) and unzip it to have access to the `img` file.

### find the disk name
```
diskutil list
```

### unmount the disk to allow writing
```
diskutil unmountDisk /dev/disk<num>
```

### move the image to the disk
```
sudo dd bs=1M if=2017-11-29-raspbian-stretch-lite.img  of=/dev/rdisk2 conv=sync
```

> **Note**: 1M is needed for GNU coreutils. 1m may be used otherwise.

Add an empty ssh file onto the boot partition of the SD card. The volume should be located at `/Volumes/boot`.

### Wifi

[cli setup](https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md)

http://weworkweplay.com/play/automatically-connect-a-raspberry-pi-to-a-wifi-network/

```
wpa_passphrase "networkname" "testingPassword" | sudo tee -a /etc/wpa_supplicant/wpa_supplicant.conf > /dev/null

# edit wpa_supplicant.conf to remove commented password
wpa_cli -i wlan0 reconfigure
```

Verify that the pi has a network connection by seeing `inet addr` from `ifconfig wlan0`

### updating
```
sudo apt-get update
sudo apt-get dist-upgrade
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

