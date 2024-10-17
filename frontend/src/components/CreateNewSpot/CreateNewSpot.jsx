import './CreateNewSpot.css';
import { useState } from 'react';
const CreateNewSpot = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    }

    const [formData, setFormData] = useState({
        country: '',
        streetAddress: '',
        city: '',
        state: '',
        title: '',
        price: '',
        photos: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    return (
        <div className="create-spot-form">
            <h1>Create a New Spot</h1>
            <h3>Where is your place located?</h3>
            <p>Guests will only get your exact address once they booked a reservation.</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Country
                    <input type="text" name="country" placeholder="Country" onChange={handleChange} />
                </label>
                <label>
                    Street Address
                    <input type="text" name="streetAddress" placeholder="Street Address" onChange={handleChange} />
                </label>
                <div className="inputGroup">
                    <label>
                        City
                    <input type="text" name="city" placeholder="City" onChange={handleChange} />
                    </label>
                    <label>
                        State
                    <input type="text" name="state" placeholder="State" onChange={handleChange} />
                    </label>
                </div>
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special
                    amenities like fast wifi or parking, and what you love
                    about the neighborhood.</p>  
                <textarea placeholder="Please write at least 30 characters" onChange={handleChange}></textarea>
                <h3>Create a title for your spot</h3>
                <p>Catch guests&apos; attention with a spot title that highlights what makes your special.</p>           
                <input type="text" name="title" placeholder="Title" onChange={handleChange} />
                <h3>Set a base price for your spot</h3>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <input type="number" name="price" placeholder="Price" onChange={handleChange} />
                <h3>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot.</p>
                <input type="text" name="photo" placeholder="Preview Image URL" onChange={handleChange} />
                <input type="text" name="photo" placeholder="Image URL" onChange={handleChange} />
                <input type="text" name="photo" placeholder="Image URL" onChange={handleChange} />
                <input type="text" name="photo" placeholder="Image URL" onChange={handleChange} />
                <input type="text" name="photo" placeholder="Image URL" onChange={handleChange} />
                <button type="submit">Create Spot</button>
            </form>
        </div>
    )
}

export default CreateNewSpot;