import { useState } from 'react';
import './CreateNewSpot.css';
import { useDispatch } from 'react-redux';
import { createSpot } from '../../store/spots'; // Assuming you have this action creator
import { useNavigate } from 'react-router-dom';

const CreateNewSpot = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        country: '',
        address: '',
        city: '',
        state: '',
        description: '',
        name: '',
        price: '',
        lat: '',
        lng: '',
        previewImage: '',
        photos: ['', '', '', '']
    });

    const [errors, setErrors] = useState({});
    const [additionalPhotos, setAdditionalPhotos] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        console.log('Validating form data:', formData);

        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.address) newErrors.address = "Street Address is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.state) newErrors.state = "State is required";
        if (formData.description.length < 30) newErrors.description = "Description needs 30 or more characters";
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.price) newErrors.price = "Price per night is required";
        if (!formData.previewImage) newErrors.previewImage = "Preview Image URL is required";
        if (!formData.lat || isNaN(formData.lat) || formData.lat < -90 || formData.lat > 90) {
            newErrors.lat = "Latitude must be between -90 and 90";
        }
        if (!formData.lng || isNaN(formData.lng) || formData.lng < -180 || formData.lng > 180) {
            newErrors.lng = "Longitude must be between -180 and 180";
        }
        
        console.log('Validation errors:', newErrors);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            try {
                const newSpotData = {
                    country: formData.country,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    description: formData.description,
                    name: formData.name,
                    price: formData.price,
                    lat: formData.lat,
                    lng: formData.lng,
                    previewImage: formData.previewImage,
                    photos: formData.photos
                };

                const createdSpot = await dispatch(createSpot(newSpotData));

                if (createdSpot && createdSpot.id) {
                    console.log('Spot created successfully');
                    navigate(`/spots/${createdSpot.id}`);
                } else {
                    console.log('Creation failed');
                    setErrors(prevErrors => ({ 
                        ...prevErrors, 
                        submit: 'Failed to create spot. Please try again.'
                    }));
                }
            } catch (error) {
                console.error('Error creating spot:', error);
                setErrors(prevErrors => ({ 
                    ...prevErrors, 
                    submit: 'An unexpected error occurred. Please try again.'
                }));
            }
        } else {
            setErrors(validationErrors);
        }
    };

    const addPhotoInput = () => {
        setAdditionalPhotos([...additionalPhotos, '']);
    };

    return (
        <div className="create-spot-form">
            <h1>Create a New Spot</h1>
            {Object.keys(errors).length > 0 && (
                <div className="error-messages">
                    {Object.values(errors).map((error, index) => (
                        <p key={index} className="error">{error}</p>
                    ))}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <h3>Where is your place located?</h3>
                <p>Guests will only get your exact address once they booked a reservation.</p>
                <label>
                    Country
                    <input type="text" name="country" value={formData.country} onChange={handleInputChange} placeholder="Country" />
                    {errors.country && <span className="error">{errors.country}</span>}
                </label>
                <label>
                    Street Address
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" />
                    {errors.address && <span className="error">{errors.address}</span>}
                </label>
                <div className="inputGroup">
                    <label>
                        City
                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" />
                        {errors.city && <span className="error">{errors.city}</span>}
                    </label>
                    <label>
                        State
                        <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" />
                        {errors.state && <span className="error">{errors.state}</span>}
                    </label>
                </div>
                <div className="inputGroup">
                    <label>
                        Latitude
                        <input type="number" name="lat" value={formData.lat} onChange={handleInputChange} placeholder="Latitude" step="any" />
                        {errors.lat && <span className="error">{errors.lat}</span>}
                    </label>
                    <label>
                        Longitude
                        <input type="number" name="lng" value={formData.lng} onChange={handleInputChange} placeholder="Longitude" step="any" />
                        {errors.lng && <span className="error">{errors.lng}</span>}
                    </label>
                </div>
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Please write at least 30 characters"></textarea>
                {errors.description && <span className="error">{errors.description}</span>}
                
                <h3>Create a title for your spot</h3>
                <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name of your spot" />
                {errors.name && <span className="error">{errors.name}</span>}
                
                <h3>Set a base price for your spot</h3>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Price per night (USD)" />
                {errors.price && <span className="error">{errors.price}</span>}
                
                <h3>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot.</p>
                <input type="text" name="previewImage" value={formData.previewImage} onChange={handleInputChange} placeholder="Preview Image URL" />
                {errors.previewImage && <span className="error">{errors.previewImage}</span>}
                
                {formData.photos.map((photo, index) => (
                    <input 
                        key={index}
                        type="text" 
                        name={`photos[${index}]`}
                        value={photo}
                        onChange={(e) => {
                            const newPhotos = [...formData.photos];
                            newPhotos[index] = e.target.value;
                            setFormData({ ...formData, photos: newPhotos });
                        }}
                        placeholder="Image URL" 
                    />
                ))}
                
                {additionalPhotos.map((photo, index) => (
                    <input 
                        key={`additional-${index}`}
                        type="text" 
                        value={photo}
                        onChange={(e) => {
                            const newAdditionalPhotos = [...additionalPhotos];
                            newAdditionalPhotos[index] = e.target.value;
                            setAdditionalPhotos(newAdditionalPhotos);
                        }}
                        placeholder="Image URL" 
                    />
                ))}
                
                <button type="button" onClick={addPhotoInput}>Add Another Photo</button>
                
                <button type="submit">Create Spot</button>
            </form>
        </div>
    );
}

export default CreateNewSpot;
