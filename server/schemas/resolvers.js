const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const foundUser = await User.findOne({
                    $or: [{ _id: user ? context.user._id : args.id }, { username: context.username }],
                });
    
                return foundUser;
            }

            throw new AuthenticationError ("Cannot find a user with this id!");
        }
    },
    Mutation: {
        addUser: async (parent, {username, email, password}) => {
            const user = await User.addUser({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { username, email, password }) => {
            const user = await User.findOne({ $or: [{ username }, { email }] });
            if (!user) {
                throw new AuthenticationError('Cannot find this user');
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw new AuthenticationError('Wrong password!');
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { book }, context) => {
            console.log(user);
            try {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user },
                { $addToSet: { savedBooks } },
                { new: true, runValidators: true }
              );
              return updatedUser;
            } catch (err) {
              console.log(err);
              return new AuthenticationError(err);
            };
        },
        removeBook: async (parent, { bookId }, context) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            );
            if (!updatedUser) {
                throw new AuthenticationError('Could not find user with this id!')
            }
            return updatedUser;
        },
    },
};

module.exports = resolvers;