const devicePort = 3080;
const deviceName = "Haroldo";
// const devicePort = 3081;
// const deviceName = "Assadeira";

const net = require('net');
const client = new net.Socket();
let cont = 0;

net.createServer((socket) => {
    socket.pipe(socket);

    socket.on('connect', () => {
        console.log('connected');
    });

    socket.on('data', (data) => {
        const newData = data.toString();
        console.log("Data: ", newData);
        const size = newData.split(' ').length;
        if (newData.includes('RON') || size != 3) {
            return;
        }

        if (!newData.includes('CONECTAR')) {
            const [name, ip, port] = newData.split(' ');
            client.connect(port, ip, () => client.write(`${deviceName} CONECTAR ${name}`));
            client.on('data', (__data) => {
                console.log(__data.toString());
            });
        } else {
            sendTemp(newData, socket);
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

sendTemp = (__data, _client) => {
    const estado = Math.random() >= 0.5;
    const temp = Math.random() * 100;
    setInterval(() => {
        _client.write(`${temp} ${estado ? 'ATIVADO' : 'DESATIVADO'} ${cont * 30}`);
        cont++;
    }, 3000);
    return cont;
}

