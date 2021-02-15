const Author = {
    register_by: ({register_by}, args, {db}, info) => {
        return db.users.find(user => user.id === register_by)
    },
    books: ({id}, args, {db}, info) => {
        return db.books.filter(book => book.writted_by === id)
    }
}

export default Author;