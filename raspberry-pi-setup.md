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


