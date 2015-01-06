import os, datetime, time, json

import RPi.GPIO as GPIO
GPIO.setwarnings(False) 

SENSOR_PIN = 3
LED_PIN = 17
GPIO.setmode(GPIO.BCM)

class LightSensor(object):

	def __init__(self):
		light_level = self.read_light(SENSOR_PIN)

		if light_level > 70:
			self.led(pin=LED_PIN, on=True)
		else:
			self.led(pin=LED_PIN, on=False)

	def read_light(self, pin):
		reading = 0
		GPIO.setup(pin, GPIO.OUT)
		GPIO.output(pin, GPIO.LOW)
		time.sleep(0.1)

		GPIO.setup(pin, GPIO.IN)
		
		# This takes about 1 millisecond per loop cycle
		while (GPIO.input(pin) == GPIO.LOW):
			reading += 1

		print reading
		return reading

	def led(self, pin, on):
		GPIO.setup(pin, GPIO.OUT)

		if on:
			GPIO.output(pin, GPIO.HIGH)
		else:
			GPIO.output(pin, GPIO.LOW)



if __name__ == '__main__':
	LightSensor()
