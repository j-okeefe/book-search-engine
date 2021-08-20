import { gql } from '@apollo/client';

export const GET_ME = gql`
    query getMe {
        me {
            _id
            username
            email
            bookCount
            SavedBooks {
                authors
                title
                bookId
                description
                image
                link
            }
        }
    }
`;