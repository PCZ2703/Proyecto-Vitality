const express = require('express');
const router = express.Router();
const SoporteTicket = require('../models/SoporteTicket');

router.get('/', async (req, res) => {
    try {
        const tickets = await SoporteTicket.find();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const ticket = await SoporteTicket.findById(req.params.id);
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoTicket = new SoporteTicket(req.body);
        const ticketGuardado = await nuevoTicket.save();
        res.status(201).json({ codigo: 201, data: ticketGuardado, mensaje: "ticket almacenado" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const ticketActualizado = await SoporteTicket.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(202).json({ codigo: 202, data: ticketActualizado, mensaje: "ticket actualizado" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await SoporteTicket.findByIdAndDelete(req.params.id);
        res.status(202).json({ codigo: 202, data: req.params.id, mensaje: "ticket eliminado" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

module.exports = router;