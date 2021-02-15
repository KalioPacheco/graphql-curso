const Book = {
    writted_by: ({writted_by}, args, {db}, info) => {
        return db.authors.find(author => author.id === writted_by)
    },
    register_by: ({register_by}, args, {db}, info) => {
        return db.users.find(user => user.id === register_by)
    }
}

export default Book;