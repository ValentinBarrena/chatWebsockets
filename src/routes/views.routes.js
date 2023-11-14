import { Router } from "express";

const router = Router();

router.get('/chat', (req, res) => {
    res.render('chat', {
        title: 'Coder Compras chat'
    })
})

export default router;
