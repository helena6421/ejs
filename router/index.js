// Express - это веб-фреймворк маршрутизации и промежуточной обработки с минимальной собственной функциональностью: 
// приложение Express, по сути, представляет собой серию вызовов функций промежуточной обработки.


import { Router } from 'express'
const router = Router()

import { single } from '../multer'

import store, { books as _books } from '../store'
import Book from '../classes/Book'

router.get('/api/books', (req, res) => {
    res.status(200).json(_books)
});

router.get('/api/books/:id', (req, res) => {
    const {books} = store;
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if( idx !== -1) {
        res.json(books[idx])
    } else {
        res.status(404).json('404 | страница не найдена')
    }

});

router.post('/api/books', single('book-file'), (req, res) => {
    const {books} = store;
    let fileBook = "";
    if(req.file){
        const { path } = req.file
        fileBook = path;
    }

    const {title, description, authors, favorite, fileCover, fileName, count} = req.body;

    console.log(fileBook)

    const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook, count);
    books.push(newBook)

    res.status(201).json(newBook)
    
});

router.put('/api/books/:id', (req, res) => {
    const {books} = store;
    const {title, description, authors, favorite, fileCover, fileName, fileBook, count} = req.body;
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx !== -1){
        books[idx] = {
            ...books[idx],
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
            fileBook, 
            count,
        }

        res.json(books[idx])
    } else {
        res.status(404).json('404 | страница не найдена')
    }
});

router.delete('/api/books/:id', (req, res) => {
    const {books} = store;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id)
     
    if(idx !== -1){
        books.splice(idx, 1)
        res.status(204).json("204 | книга удалена")
    } else {
        res.status(404).json('404 | страница не найдена')
    }
});

router.get('/api/books/:id/download', (req, res) => {
    const {books} = store;
    const {id} = req.params;
    const book = books.find(el => el.id === id)
    if(book === undefined){
        res.status(404).json('404 | страница не найдена')
    } 
    res.download(book.fileBook, book.id, err => {
        if (err)
            res.status(404).json('404 | страница не найдена');
    });
    
});

export default router
