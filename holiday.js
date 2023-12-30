const HoliUdp = require('holiday-udp');

const sendLights = (holidayHost, lightsArray) => {
	const holiudp = new HoliUdp(holidayHost);

	console.info('Sending lights', lightsArray);

	holiudp.send(lightsArray, function (err) {
		if (err) {
			console.error(err);
			return err;
		}
		return true;
	})
};

module.exports = sendLights