const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body);
        const usuarioGuardado = await nuevoUsuario.save();
        res.status(201).json({ codigo: 201, data: usuarioGuardado, mensaje: "usuario almacenado" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(202).json({ codigo: 202, data: usuarioActualizado, mensaje: "usuario actualizado" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Usuario.findByIdAndDelete(req.params.id);
        res.status(202).json({ codigo: 202, data: req.params.id, mensaje: "usuario eliminado" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

module.exports = router;