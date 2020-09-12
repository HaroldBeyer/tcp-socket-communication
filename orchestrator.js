const net = require('net');
const { readFile } = require('fs');
const client = net.Socket();

readFile("../atividade3/lista_dispositivos.txt", (err, data) => {
    const devices = data.toString().split("\n").map((aux) => {
        const obj = aux.split(' ');
        return {
            name: obj[0],
            ip: obj[1],
            port: obj[2]
        }
    }
    );

    const devicesLength = devices.length;

    for (let index = 0; index < devicesLength; index++) {
        const currentDevice = devices[index];
        let nextDevice;
        if (devices[index + 1]) {
            nextDevice = devices[index + 1];
        } else if (index != 0) {
            nextDevice = devices[0];
        } else if (devices[index - 1]) {
            nextDevice = devices[index - 1];
        } else {
            console.log("ERROR");
            throw (new Error("Unavailable device"));
        }
        // console.log("next", nextDevice);
        nextDevice.port = nextDevice.port.replace('\r', '');
        nextDevice.port = nextDevice.port.replace('r', '');

        let msg = `${currentDevice.name} CONECTAR ${nextDevice.name}`;
        client.connect(nextDevice.port, nextDevice.ip, () => {
            console.log("Conectou!", nextDevice.name);
            client.write('serverrecept', { msg });
        });
        client.on('clientrecept', (mensagem) => {
            console.log("Mensagem: ", mensagem);
        });

    }
});
