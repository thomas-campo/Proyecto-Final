import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";
import { Product } from "../manager/ProductManager.js";

const productManager = new ProductManager();

const router = Router();

const product = await productManager.getProducts();

router.get('/', async (req,res) => {//listo
    try{
        const maxProducts = req.query.limit;
        const products = await product
        if(maxProducts){
            const limitProduct = products.slice( 0 , maxProducts);
            res.send(limitProduct);
        } else{
            res.send(products)
        }
    }catch(err){
        console.error(err)
        res.status(500).send({error:"Error interno del servidor"});
    }
})

router.get('/:pid', async (req,res) => {//listo
    try{
        const productsId = req.params.pid;
        console.log(productsId)
        const products = await product;
        const search = products.find( u => u.id == productsId);
        res.send(search);
    }catch(err){
        console.error(err)
        res.status(500).send({error:"Error interno del servidor"});
    }
})

router.post('/', async (req,res)=>{//listo
    try{
        if(!req.body.title ||
            !req.body.description ||
            !req.body.code ||
            !req.body.price ||
            !req.body.status ||
            !req.body.stock ||
            !req.body.category ||
            !req.body.thumbnails){
                console.error('el producto esta incompleto');
                res.send()
                return
        }

        const title = req.body.title
        const description = req.body.description
        const code = req.body.code
        const price = req.body.price
        const status = req.body.status
        const stock = req.body.stock || 100
        const category = req.body.category
        const thumbnails = req.body.thumbnails || "sin archivo"
        
        const newProduct = new Product(title, description, price, category, thumbnails, code, stock, status);
        const newProductCreated = await productManager.addProduct(newProduct);
        
        res.json(newProductCreated)

        const products = await productManager.getProducts();
        req.io.emit('products',products);
    } catch (err) {
        res.status(500).send({error:"Error interno del servidor"});
    }

})

router.put('/:pid', async (req,res) => {//listo
    try{
        const productoId = req.params.pid;

        const title = req.body.title;
        const description = req.body.description;
        const price = req.body.price;
        const category = req.body.category;
        const thumbnails = req.body.thumbnails;
        const code = req.body.code;
        const stock = req.body.stock;
        const status = req.body.status;

        if (!productoId) return res.send('no enviaste el producto a actualizar');
        
        const product = new Product(title, description, price, category, thumbnails, code, stock, status);
        const updatedProduct = await productManager.updateProduct(productoId, product);
        res.send({status:"success",message:"producto actualizado"});
    }catch(err){
        const productoId = req.params.pid;
        console.log(`error en actualizar el producto ${productoId}`)
        res.send(null)
    }
})

router.delete('/:pid', async (req,res) =>{//listo
    try{
        const productId = req.params.pid;
        await productManager.deleteProduct(productId);
        const products = await productManager.getProducts();
        req.io.emit('products',products);
        res.send({status:"success",message:"producto eliminado"});
    }catch(err){
        console.log(err)
        res.status(500).send({error:"Error interno del servidor"});
    }
})

export default router;