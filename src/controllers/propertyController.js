// Importing Property from Index.js
import { Property } from '../models/index.js';
// Importing validationResult from express-validator for input validation
import { validationResult } from 'express-validator';

// CRUD operations for Property
// DONE: GetProperties/getPropertyByID - READ
// DONE: createProperty - CREATE
// DONE: updateProperty - UPDATE
// DONE: deleteProperty - DELETE
// TO DO: Better error handling, integrate validation and JWT for user/admin auth. 

// Get all properties
export const getProperties = async (req, res) => {
    try {
        // Fetch all properties from the database
        const properties = await Property.find();
        // Send the properties as JSON
        res.status(200).json(properties);
    } catch (error) {
        // Basic error handling
        res.status(500).json({ message: error.message });
    }
};

// Get a property by ID
export const getPropertyById = async (req, res) => {
    try {
        // Find property by ID
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });
        // Send the property as JSON
        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Unable to retrieve the property' });
    }
};

// Create a new property
export const createProperty = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newProperty = new Property(req.body);
        await newProperty.save();
        res.status(201).json(newProperty);
    } catch (error) {
        res.status(400).json({ message: 'Error: Unable to create property' });
    }
};

// Update a property
export const updateProperty = async (req, res) => {
    // Validate incoming data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProperty) return res.status(404).json({ message: 'Property not found' });
        res.status(200).json(updatedProperty);
    } catch (error) {
        res.status(400).json({ message: 'Error: Unable to update property' });
    }
};

// Delete a property
export const deleteProperty = async (req, res) => {
    try {
        // Delete the property
        const deletedProperty = await Property.findByIdAndDelete(req.params.id);
        if (!deletedProperty) return res.status(404).json({ message: 'Property not found' });
        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error: Unable to delete property' });
    }
};
