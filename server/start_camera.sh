#!/bin/bash
RESOLUTION="400x300"
FPS="16"
PORT="8080"
modprobe bcm2835-v4l2
mjpg_streamer -i "libinput_uvc.so.0 -d /dev/video0 -r $RESOLUTION -f $FPS" -o "liboutput_http.so.0 -p $PORT"
