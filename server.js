const port = 3081;

const net = require('net');

let returnMsg;
net.createServer((socket) => {
    console.log('Socket Conectado');

    socket.on('connect', () => {
        console.log('connected');
    });

    socket.on('data', (data) => {
        console.log('data', data);
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

    socket.on('serverrecept', (msg) => {
        console.log("msg: ", msg);

        const name = msg.returnMsg.parse(' ');
        const estado = Math.random() >= 0.5;
        let tries = 0;
        if (estado) {
            setTimeout(() => {
                returnMsg = `${name} ATIVADO ${tries * 30}`;
                tries++;
            }, 30000);
        } else {
            returnMsg = "DESATIVADO";
        }
    });
    if (returnMsg) {
        socket.emit('clientrecept', { returnMsg });
    }
}).listen(port, () => {
    console.log('TCP SERVER na porta', port);
});
