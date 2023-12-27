const HoliUdp = require('holiday-udp');
let	holiudp;

const sendLights = (holidayHost, lightsArray, responseFunc) => {
	holiudp = new HoliUdp(holidayHost);

	console.info('Sending lights', lightsArray);

	holiudp.send(lightsArray, function (err) {
		if (err) {
			console.error(err);
			if (responseFunc) { responseFunc(err); }
		}
	});
};

module.exports = sendLights