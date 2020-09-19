// const devicePort = 3080;
// const deviceName = "Torradeira";
const devicePort = 3081;
const deviceName = "Assadeira";

const net = require('net');
const deviceIp = "127.0.0.1";

net.createServer((socket) => {

    console.log('Socket Conectado');
    socket.pipe(socket);

    socket.on('connect', () => {
        console.log('connected');
    });

    socket.on('data', (data) => {
        const newData = data.toString();
        console.log("Data: ", newData);
        //se conectar com device
        const client = new net.Socket();
        if (newData.includes('name') && newData.includes('ip') && newData.includes('port') && !newData.includes('msg')) {
            console.log('got into first');
            const { name, ip, port } = JSON.parse(newData);
            const msg = { msg: `${deviceName} CONECTAR ${name}`, device: { ip: deviceIp, name: deviceName, port: devicePort } };
            client.connect(port, ip, () => client.write(JSON.stringify(msg)));
            console.log("Done");
            // client.on('data', (_data) => console.log('Data: ', _data.toString()));
        } else if (newData.includes('msg')) {
            console.log('got into second');
            const { msg, device } = JSON.parse(newData);
            console.log("Got msg: ", msg);
            client.connect(device.port, device.ip, () => {
                let cont = 0;
                const estado = Math.random() >= 0.5;
                setTimeout(() => {
                    client.write(`${deviceName} ${estado ? 'ATIVADO' : 'DESATIVADO'} ${cont * 30}`);
                    cont++;
                }, 30000);
            });
        } else if (newData.includes('barril')) {

        }
    });

    socket.on('end', () => {
        console.log('end');
    });
    socket.on('close', () => {
        console.log('close');
    });
    socket.on('error', (e) => {
        console.log('error ', e);
    });
}).listen(devicePort, () => {
    console.log('TCP SERVER na porta', devicePort);
});
