import mongoose from 'mongoose'
import { User, UserSchema} from "./db.js"

const users = [
    {
      username: 'johndoe',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      dob: new Date('1996-05-15')
    },
    {
      username: 'janesmith',
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '9876543210',
      dob: new Date('1985-10-25') 
    }
]

await User.deleteMany()
console.log('Deleted Users')

await User.insertMany(users)
console.log('Added Users')

// Closing connection to the database 
mongoose.disconnect()