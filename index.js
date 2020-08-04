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

server.post('/api/posts', (req,res) => {
    const newPost = req.body

        if(!newPost.title || !newPost.contents){
            return res.status(400)
                .json({ errorMessage: "Please provide title and contents for the post." })
        } else {
            Posts.insert(newPost)
                .then(post => {
                    Posts.findById(post.id)
                    .then(added => {
                        res.status(201).json(added)
                    })
                })
                .catch(error => {
                    console.log(error)
                    res.status(500)
                        .json({ error: "There was an error while saving the post to the database" })
                })
        } 
})

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

server.put('/api/posts/:id', (req, res) => {
    const update = req.body
    if(!update.title || !update.contents){
        return res.status(400)
            .json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        Posts.update(req.params.id, update)
            .then(post => {
                if(post) {
                    Posts.findById(req.params.id)
                        .then(updated => {
                            res.status(200).json(updated)
                    })       
            } else(
                res.status(404)
                    .json({ message: "The post with the specified ID does not exist." })
            )
        })
        .catch(error => {
            console.log(error)
            res.status(500)
                .json({ error: "The post information could not be modified." })
        })
    }
})

server.delete('/api/posts/:id', (req, res) => {
   Posts.remove(req.params.id)
    .then(check => {
        if(check > 0){
            res.status(200)
                .json({ message : "Your post has been successfully deleted." })
        } else{
            res.status(404)
                .json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500)
            .json({ error: "The post could not be removed" })
    }) 
})
//   /api/posts/:id/comments (get,post)

server.get('/api/posts/:id/comments', (req, res) => {
    Posts.findPostComments(req.params.id)
        .then(comments => {
            if(comments){
                res.status(200).json(comments)
            } else{
                res.status(404)
                    .json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500)
                .json({ error: "The comments information could not be retrieved." })
        })
})

server.post('/api/posts/:id/comments', (req, res) => {
    const newComment = req.body

    try{
        if(!newComment.text){
        return res.status(400)
            .json({ errorMessage: "Please provide text for the comment." })
        } else {
            newComment.post_id = req.params.id
            Posts.insertComment(newComment)
                .then(comment => {
                    Posts.findCommentById(comment.id)
                    .then(added => {
                        res.status(201).json(added)
                    })
            })
            .catch(error => {
                console.log(error)
                res.status(404)
                    .json({ message: "The post with the specified ID does not exist." })
              })
        }
    }catch(error){
        console.log(error)
        res.status(500)
        .json({ error: "There was an error while saving the comment to the database" })
    }
})





//--------------------------------------------------------------//
const port = 5000
server.listen(port, () => {
    console.log('\n*** Server Running on http://localhost:5000 ***\n');
})