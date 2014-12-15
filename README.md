# Baby Video Monitor

This is my take on using a Raspberry PI as a Baby Monitor. Including Camera and Temperature sensor.

## Setup
- Get a Raspberry PI, camera and temperature sensor
- Camera
  - [Excellent tutorial using mjpeg-streamer](http://www.the-hawkes.de/a-raspberry-pi-powered-baby-monitor-22.html)
  - Note: Need to run `modprobe bcm2835-v4l2` ([See start_camera.sh](../master/server/start_camera.sh))
- [Temperature](https://www.modmypi.com/blog/ds18b20-one-wire-digital-temperature-sensor-and-the-raspberry-pi)
- [Configure WIFI](http://weworkweplay.com/play/automatically-connect-a-raspberry-pi-to-a-wifi-network/)
- Clone repo
- Put nginx config in correct place and adjust accordingly.
- Copy (and edit) cron config.




[LICENSE](../master/LICENSE)