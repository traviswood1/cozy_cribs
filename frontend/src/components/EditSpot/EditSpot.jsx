import './EditSpot.css';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSpotById, updateSpot } from '../../store/spots';
import { fetchSpotImages } from '../../store/spotImages';

const EditSpot = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const spot = useSelector(state => state.spots.singleSpot);

    const [formData, setFormData] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await dispatch(fetchSpotById(spotId));
            await dispatch(fetchSpotImages(spotId));
            setIsLoading(false);
        };
        loadData();
    }, [spotId, dispatch]);

    useEffect(() => {
        console.log('Spot data:', spot);
        if (spot && Object.keys(spot).length > 0) {
            const images = spot.SpotImages || [];
            
            let previewImage = '';
            let additionalImages = [];

            if (images.length > 0) {
                const previewImageObj = images.find(img => img.preview);
                previewImage = previewImageObj ? previewImageObj.url : images[0].url;
                additionalImages = images.filter(img => !img.preview).map(img => img.url);
            }

            setFormData({
                country: spot.country || '',
                address: spot.address || '',
                city: spot.city || '',
                state: spot.state || '',
                description: spot.description || '',
                name: spot.name || '',
                price: spot.price || '',
                previewImage: previewImage,
                photos: [...additionalImages, ...Array(4 - additionalImages.length).fill('')].slice(0, 4),
                lat: spot.lat || '',
                lng: spot.lng || '',
            });
            setIsLoading(false);
        }
    }, [spot]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    }

    const handlePhotoChange = (index, value) => {
        setFormData(prevData => {
            const newPhotos = [...prevData.photos];
            newPhotos[index] = value;
            return { ...prevData, photos: newPhotos };
        });
    }

    const validateForm = () => {
        let newErrors = {};
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
        
        setErrors(newErrors);
        console.log('Validation errors:', newErrors);
        
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            try {
                const updatedSpotData = {
                    ...formData,
                    lat: parseFloat(formData.lat) || 0,
                    lng: parseFloat(formData.lng) || 0,
                    SpotImages: [
                        { url: formData.previewImage, preview: true },
                        ...formData.photos.filter(url => url.trim() !== '').map(url => ({ url, preview: false }))
                    ]
                };

                console.log('Updating spot with data:', updatedSpotData);
                const updatedSpot = await dispatch(updateSpot(spotId, updatedSpotData));

                if (updatedSpot && updatedSpot.id) {
                    console.log('Spot updated successfully');
                    navigate(`/spots/${spotId}`);
                } else {
                    console.log('Update failed');
                    setErrors(prevErrors => ({ 
                        ...prevErrors, 
                        submit: 'Failed to update spot. Please try again.'
                    }));
                }
            } catch (error) {
                console.error('Error updating spot:', error);
                setErrors(prevErrors => ({ 
                    ...prevErrors, 
                    submit: 'An unexpected error occurred. Please try again.'
                }));
            }
        } else {
            setErrors(validationErrors);
        }
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!spot || Object.keys(spot).length === 0) {
        return <div>Error: Unable to load spot data</div>;
    }

    if (!formData) {
        return <div>Error: Unable to initialize form data</div>;
    }

    return (
        <div className="edit-spot-form">
            <h1>Update your Spot</h1>
            {formData && (
                <form onSubmit={handleSubmit}>
                    <h3>Where is your place located?</h3>
                    <p>Guests will only get your exact address once they booked a reservation.</p>
                    <label>
                        Country
                        <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
                        {errors.country && <span className="error">{errors.country}</span>}
                    </label>
                    <label>
                        Street Address
                        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
                        {errors.address && <span className="error">{errors.address}</span>}
                    </label>
                    <div className="inputGroup">
                        <label>
                            City
                            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
                            {errors.city && <span className="error">{errors.city}</span>}
                        </label>
                        <label>
                            State
                            <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" />
                            {errors.state && <span className="error">{errors.state}</span>}
                        </label>
                    </div>
                    <div className="inputGroup">
                        <label>
                            Latitude
                            <input type="number" name="lat" value={formData.lat} onChange={handleChange} placeholder="Latitude" step="any" />
                            {errors.lat && <span className="error">{errors.lat}</span>}
                        </label>
                        <label>
                            Longitude
                            <input type="number" name="lng" value={formData.lng} onChange={handleChange} placeholder="Longitude" step="any" />
                            {errors.lng && <span className="error">{errors.lng}</span>}
                        </label>
                    </div>
                    <h3>Describe your place to guests</h3>
                    <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Please write at least 30 characters"></textarea>
                    {errors.description && <span className="error">{errors.description}</span>}
                    
                    <h3>Create a title for your spot</h3>
                    <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name of your spot" />
                    {errors.name && <span className="error">{errors.name}</span>}
                    
                    <h3>Set a base price for your spot</h3>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price per night (USD)" />
                    {errors.price && <span className="error">{errors.price}</span>}
                    
                    <h3>Liven up your spot with photos</h3>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <label>
                        Preview Image
                        <input 
                            type="text" 
                            name="previewImage" 
                            value={formData.previewImage} 
                            onChange={handleChange} 
                            placeholder="Preview Image URL" 
                        />
                        {errors.previewImage && <span className="error">{errors.previewImage}</span>}
                    </label>
                    
                    <h3>Additional Photos</h3>
                    {formData.photos.map((photo, index) => (
                        <input 
                            key={index}
                            type="text" 
                            value={photo}
                            onChange={(e) => handlePhotoChange(index, e.target.value)}
                            placeholder={`Image URL`} 
                        />
                    ))}
                    
                    <button type="submit">Update Spot</button>
                </form>
            )}
        </div>
    );
}

export default EditSpot;
