//const express = require('express');
//const path = require('path');
import express from 'express';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/*', (req, res)  => {
  res.sendFile(path.join(__dirname,  'index.html'));
});

app.listen(80, () => {
  console.log(`Servidor Express rodando na porta 80`);
});