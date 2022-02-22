const { ApolloServer, gql } = require('apollo-server')
const path = require('path')
const fs = require('fs')

const typeDefs = gql`
  type File {
    url: String!
  }

  type ImageDataResponse {
    url: String!
    name: String!
  }

  input ImageData {
    image: Upload!
    name: String
  }

  type Query {
    hello: String!
  }

  type Mutation {
    uploadFile(file: Upload!): File!
    uploadImageData(imageData: ImageData) : ImageDataResponse 
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello World',
  },
  Mutation: {
    uploadFile: async (parent, { file }) => {

      console.log("file ===>", file)

      const { createReadStream, filename, minetype, encoding } = await file
      const stream = createReadStream()
      // return {
      //   url: __dirname
      // }
      const pathName = path.join(__dirname, `/public/images/${filename}`);
      await stream.pipe(fs.createWriteStream(pathName))
      return {
        url: `http://localhost:4000/images/${filename}`
      }
    },
    uploadImageData: async (parent, { imageData }) => {

      console.log("imageData===>", imageData)

      const {createReadStream, filename, minetype, encoding} = await imageData.image;
      const stream = createReadStream()
      const pathName = path.join(__dirname, `/public/imagedata/${filename}`);
      await stream.pipe(fs.createWriteStream(pathName))
      return {
        url: `http://localhost:4000/imagedata/${filename}`,
        name: imageData.name
      }
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
