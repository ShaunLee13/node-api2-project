const express = require('express')

const Posts = require('./data/db')

const server = express()
server.use(express.json());



server.get('/', (req, res) => {
    res.send(`
      <h2>Node 2 Self Project</h>  
    `);
  });

server.get('/api/posts', (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            console.log(error)
            res.status(500)
                .json({ error: "The posts information could not be retrieved." })

        })
})
//   /api/posts (get, post)
//   /api/posts/:id/ (get,delete,put)

server.get('/api/posts/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if(post){
                res.status(200).json(post)
            } else{
                res.status(404)
                    .json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500)
                .json({ error: "The post information could not be retrieved." })
        })
})
//   /api/posts/:id/comments (get,post)  

const port = 5000
server.listen(port, () => {
    console.log('\n*** Server Running on http://localhost:5000 ***\n');
})