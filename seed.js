import mongoose from 'mongoose'
import { User, Property} from "./db.js"

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

const properties = [
    {
        name: 'Cozy Tiny Home',
        description: 'A charming and cozy tiny home perfect for a tranquil getaway.',
        price: 150,
        availability: [new Date('2024-09-01'), new Date('2024-09-02')],
        location: {
            city: 'Yallamby',
            state: 'NSW',
        },
        ageRestriction: 18, // Minimum age required to book
    }
];

// Async function to seed the database
async function seedDatabase() {
    try {
        // Delete existing users and properties
        await User.deleteMany();
        console.log('Deleted Users');

        await User.insertMany(users);
        console.log('Added Users');

        await Property.deleteMany();
        console.log('Deleted Properties');

        await Property.insertMany(properties);
        console.log('Added Properties');
        
    } catch (error) {
        console.error('Error seeding the database:', error);
    } finally {
        // Close the database connection
        mongoose.disconnect();
    }
}

// Call the async function
seedDatabase()