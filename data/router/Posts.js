const express = require('express')

const Posts = require('../db')

const router = express.Router()

//    /api/posts

router.get('/', (req, res) => {
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

router.post('/', (req,res) => {
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

//   /api/posts/:id/ 

router.get('/:id', (req, res) => {
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

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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
//   /api/posts/:id/comments

router.get('/:id/comments', (req, res) => {
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

router.post('/:id/comments', (req, res) => {
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

module.exports = router