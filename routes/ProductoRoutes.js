const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// GET - listar todos
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({
            mensaje: error.message,
            mensajePersonalizado: "Se cayo el api"
        });
    }
});

// GET - buscar por id
router.get('/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        res.json(producto);
    } catch (error) {
        res.status(500).json({
            mensaje: error.message,
            mensajePersonalizado: "Se cayo el api"
        });
    }
});

// POST - crear
router.post('/', async (req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
        const productoGuardado = await nuevoProducto.save();
        res.status(201).json({
            codigo: 201,
            data: productoGuardado,
            mensaje: "producto almacenado"
        });
    } catch (error) {
        res.status(400).json({
            mensaje: error.message,
            mensajePersonalizado: "Se cayo el api"
        });
    }
});

// PUT - actualizar
router.put('/:id', async (req, res) => {
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(202).json({
            codigo: 202,
            data: productoActualizado,
            mensaje: "producto actualizado"
        });
    } catch (error) {
        res.status(400).json({
            mensaje: error.message,
            mensajePersonalizado: "Se cayo el api"
        });
    }
});

// DELETE - eliminar
router.delete('/:id', async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.status(202).json({
            codigo: 202,
            data: req.params.id,
            mensaje: "producto eliminado"
        });
    } catch (error) {
        res.status(400).json({
            mensaje: error.message,
            mensajePersonalizado: "Se cayo el api"
        });
    }
});

module.exports = router;