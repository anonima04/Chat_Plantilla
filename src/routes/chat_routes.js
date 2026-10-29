import {Router} from 'express';
const router = Router();

router.get('/', (req, res) => {
    res.render('chat',{
        title: 'Chat empresarial',
        empresa: 'Mi Empresa',
        year: new Date().getFullYear(),
    });
});

export default router;