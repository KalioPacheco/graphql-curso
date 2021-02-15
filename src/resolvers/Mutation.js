import {v4 as uuid} from "uuid"

const Mutation = {
    createUser: (parent, args, {db}, info) => {
        const isEmailTaken = db.users.find(user => user.email === args.email)
        if (isEmailTaken) {
            throw new Error('Email Taken')
        }

        const user = {
            id: uuid(),
            ...args
        }

        db.users.push(user);

        return user

    },

    updateUser: (parent, args, {db}, info) => {
        const {id, ...data} = args;
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

    }
}

export default Mutation;