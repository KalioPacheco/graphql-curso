import {v4 as uuid} from "uuid"

const Mutation = {
    createUser: (parent, {data}, {db}, info) => {
        const isEmailTaken = db.users.find(user => user.email === data.email)
        if (isEmailTaken) {
            throw new Error('Email Taken')
        }

        const user = {
            id: uuid(),
            ...data
        }

        db.users.push(user);

        return user

    },

    updateUser: (parent, {id, data}, {db}, info) => {
    
        const userExits = db.users.find(user => user.id === id);
        if (!userExits) {
            throw new Error('User not found')
        }

        const isEmailTaken = db.users.some(user => user.email === data.email);

        if (isEmailTaken) {
            throw new Error('Email Taken')
        }

        db.users = db.users.map(user => {
            if (user.id === id) {
                user = {...user, ...data}
                return user;
            }
            return user
        })

        return {...userExits, ...data}

    },

    createAuthor: (parent, {data}, {db, pubsub}, info) => {
        const author = {
            id: uuid(),
            ...data
        }
        db.authors.push(author);

        pubsub.publish('author', {
            author: {
                mutation: 'CREATED',
                data: author
            }
        })

        return author;
    },

    updateAuthor: (parent, {id, data}, {db, pubsub}, info) => {
        const authorExit = db.authors.find(author => author.id === id);
        
        if (!authorExit) {
            throw new Error('Author does not exist');
        }

        db.authors = db.authors.map(author => {
            if (author.id === id) {
                author = {...author, ...data};
                return author
            }
            return author
        })

        const authorUpdated = {...authorExit, ...data}

        pubsub.publish('author', {
            author: {
                mutation: 'UPDATED',
                data: authorUpdated
            }
        })

        return {...authorExit, ...data};

    },

    createBook: (parent, {data}, {db, pubsub}, info) => {
        const isAuthorExist = db.authors.some(author => author.id === data.writted_by);

        if (!isAuthorExist) {
            throw new Error('Author does not exist');
        }
        
        const book = {
            id: uuid(),
            ...data
        }
        db.books.push(book);

        pubsub.publish(`book - ${data.writted_by}`, {
            book: {
                mutation: 'CREATED',
                data: book
            }
        })

        return book;
    },

    updateBook: (parent, {id, data}, {db, pubsub}, info) => {
        const bookExist = db.books.find(book => book.id === id);

        if (!bookExist) {
            throw new Error('Book does not exit');
        }

        const isAuthorExist = db.authors.some(author => author.id === data.writted_by);

        if (data.writted_by && !isAuthorExist) {
            throw new Error('Author does not exist');
        }

        db.books = db.books.map(book => {
            if (book.id === id) {
                book = {...book, ...data};
                return book
            }
            return book
        })

        const bookUpdated = {...bookExist, ...data};

        pubsub.publish(`book - ${bookUpdated.writted_by}`, {
            book: {
                mutation: 'UPDATED',
                data: bookUpdated
            }
        })

        return bookUpdated

    },

    deleteBook: (parent, {id}, {db, pubsub}, info) => {
        const existBook = db.books.find(book => book.id === id);
        if (!existBook) {
            throw new Error('Book no found')
        }
        db.books = db.books.reduce((acc, book) => {
            if (book.id !== id) {
                acc.push(book);
            }
            return acc;
        }, [])

        pubsub.publish(`book - ${existBook.writted_by}`, {
            book: {
                mutation: 'DELETED',
                data: existBook
            }
        })

        return existBook;

    }

}

export default Mutation;