const express = require('express')

const postsRouter = require('./data/router/Posts')

const server = express()
server.use(express.json());



server.get('/', (req, res) => {
    res.send(`
    <h2>Node 2 Self Project</h>  
    `);
});

server.use('/api/posts', postsRouter)



//--------------------------------------------------------------//
const port = 5000
server.listen(port, () => {
    console.log('\n*** Server Running on http://localhost:5000 ***\n');
})