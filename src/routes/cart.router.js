import { Router } from 'express'
import CartManager from '../manager/CartManager.js';

const routerCart = Router();

const cartManager = new CartManager();

routerCart.post('/', async(req, res) => {//listo
    try{
        const newCart = { products: [] }
        const createdCart = await cartManager.createCart(newCart)
        res.send(createdCart)
    }catch(err){
        console.log(err)
    }
})

routerCart.get('/:cid', async(req, res) => {//listo
   const cid  = req.params.cid;
   const mycart = await cartManager.getProductByCartId(cid)
   if(!mycart) return res.send("carrito id no encontrado");
   return res.send(mycart)
})

routerCart.post('/:cid/product/:pid', async(req, res) => {//no me agarra el (carts[cartIndex][productIndex].quantity+1)
    const cid = req.params.cid;
    const pid = req.params.pid;
    if(!pid || !cid) return res.send("datos erroneos");
    const updateProduct = await cartManager.addProductToCart(cid,pid);
    return res.send(updateProduct)
})

export default routerCart;