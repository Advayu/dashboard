
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    id: "",                          // Empty string for ID
    brand_id: "",                     // Empty string for brand ID
    name: "",                         // Empty string for name of the establishment
    address: "",                      // Empty string for address
    neighborhood: "",                 // Empty string for neighborhood
    street: "",                       // Empty string for street
    city: "",                         // Empty string for city
    state: "",                        // Empty string for state
    postal_code: "",                  // Empty string for postal code
    country_code: "",                 // Empty string for country code
    phone: "",                        // Empty string for phone number
    email: "",                        // Empty string for email
    opening_hours: {},                // Empty object for opening hours (can be populated later)
    closed_days: [],                  // Empty array for closed days
    manager_name: "",                 // Empty string for manager's name
    manager_phone: "",                // Empty string for manager's phone number
    images: [],                       // Empty array for image URLs
    services: "",                     // Empty array for services
    amenities: "",                    // Empty array for amenities
    accessibility_features: "",
    loyalty_enabled: false,           // Default false for loyalty program enabled
    average_rating: "0",              // Default "0" for average rating
    review_count: 0,                  // Default 0 for review count
    is_active: false,                 // Default false for is active
    // Empty string for updated date
    latitude: 0,                     // Empty string for latitude
    longitude: 0                     // Empty string for longitude
};


const outletSlice2 = createSlice({
    name: 'outlet2',
    initialState,
    reducers: {
        setOutletData2: (state, action) => {

            console.log("action.payload in outlet data 2", action.payload, state);
            return { ...state, ...action.payload };
        },

    },
});

export const { setOutletData2 } = outletSlice2.actions;
export default outletSlice2.reducer;

