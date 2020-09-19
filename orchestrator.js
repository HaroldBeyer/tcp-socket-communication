const net = require('net');
const { readFile } = require('fs');
const client = net.Socket();

const query = "1 CONNECT 2";

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

    let [origin, command, destination] = query.split(' ');
    console.log(`Origin: ${origin}, ${command}, ${destination}`);

    let originDevice = devices[origin - 1];
    let destinationDevice = devices[destination - 1];

    client.connect(originDevice.port, originDevice.ip, () => {
        console.log("Connected to orchestrator. Sending command");
        console.log(destinationDevice.name);
        const msg = `${destinationDevice.name} ${destinationDevice.ip} ${destinationDevice.port}`;
        client.write(msg);
    });
});
