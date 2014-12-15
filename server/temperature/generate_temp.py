import os, datetime, time, json

os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')


class GenerateTemp(object):

	json_file = os.path.join(os.path.dirname(__file__), 'temperature.json')
	temp_sensor = '/sys/bus/w1/devices/28-000006b08477/w1_slave'

	def __init__(self):
		readings = self.read_json()

		readings.append({
			'date': datetime.datetime.now().isoformat(' '),
			'temp': self.read_temp()
		})

		self.write_json(readings)

	def temp_raw(self):
		with open(self.temp_sensor, 'r') as f:
			lines = f.readlines()
		return lines

	def read_temp(self):
		lines = self.temp_raw()

		while lines[0].strip()[-3:] != 'YES':
			time.sleep(0.5)
			lines = self.temp_raw()

		temp_output = lines[1].find('t=')

		if temp_output != -1:
			temp_string = lines[1].strip()[temp_output+2:]
			temp_c = float(temp_string) / 1000.0
			return temp_c

	def read_json(self):
		readings = []

		with open(self.json_file, 'r') as f:
			lines = f.readlines()
		
		readings = json.loads(''.join(lines))
		return readings

	def write_json(self, readings):
		with open(self.json_file, 'w') as f:
			f.write(json.dumps(readings[:1000]))


if __name__ == '__main__':
	GenerateTemp()
