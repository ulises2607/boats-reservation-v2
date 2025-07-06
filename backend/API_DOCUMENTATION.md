# Boats Reservation API Documentation

## Base URL
```
http://localhost:3001/api/v1
```

## Boats API

### List all boats
**GET** `/boats`

Returns a paginated list of all boats with enhanced data.

#### Query Parameters
- `page` (optional): Page number for pagination (default: 1)
- `per_page` (optional): Number of items per page (default: 20, max: 100)
- `boat_type` (optional): Filter by boat type
  - Available types: `fishing`, `yacht`, `sailboat`, `motorboat`, `pontoon`, `houseboat`, `catamaran`, `speedboat`
- `min_capacity` (optional): Minimum capacity filter
- `max_capacity` (optional): Maximum capacity filter
- `location` (optional): Filter by location (partial match)
- `min_price` (optional): Minimum rental price filter
- `max_price` (optional): Maximum rental price filter
- `search` (optional): Search in boat name, description, and amenities
- `available` (optional): Filter by availability status (true/false)
- `sort_by` (optional): Sort field
  - Available options: `price`, `capacity`, `rating`, `created_at`
- `sort_direction` (optional): Sort direction (`asc` or `desc`, default: `asc`)

#### Example Requests
```bash
# Get all boats
curl -X GET "http://localhost:3001/api/v1/boats"

# Filter by boat type
curl -X GET "http://localhost:3001/api/v1/boats?boat_type=yacht"

# Filter by capacity
curl -X GET "http://localhost:3001/api/v1/boats?min_capacity=8"

# Search boats
curl -X GET "http://localhost:3001/api/v1/boats?search=fishing"

# Paginated results
curl -X GET "http://localhost:3001/api/v1/boats?page=1&per_page=5"

# Complex filtering
curl -X GET "http://localhost:3001/api/v1/boats?boat_type=yacht&min_capacity=8&location=CA&sort_by=price&sort_direction=desc"
```

#### Response Format
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Luxury Yacht",
      "description": "Stunning luxury yacht with premium amenities...",
      "price": "250000.0",
      "color": "White",
      "rent_price": "1000.0",
      "user_id": 3,
      "created_at": "2025-07-06T06:10:05.560Z",
      "updated_at": "2025-07-06T06:10:05.560Z",
      "picture": "https://example.com/yacht.jpg",
      "boat_type": "yacht",
      "capacity": 12,
      "length": null,
      "location": "Newport Beach, CA",
      "latitude": null,
      "longitude": null,
      "amenities": "[\"Air Conditioning\", \"Full Kitchen\", \"Master Suite\"]",
      "minimum_rental_hours": 4,
      "hourly_rate": null,
      "daily_rate": null,
      "images": "[\"https://example.com/yacht1.jpg\", \"https://example.com/yacht2.jpg\"]",
      "rating_average": "4.9",
      "total_reviews": 15,
      "availability_status": true,
      "boat_type_display": "Yacht",
      "capacity_text": "12 people",
      "length_text": "Length not specified",
      "location_display": "Newport Beach, CA",
      "primary_image": "https://example.com/yacht.jpg",
      "rating_stars": "★★★★★",
      "price_per_hour": "1000.0",
      "price_per_day": "1000.0",
      "amenities_list": ["Air Conditioning", "Full Kitchen", "Master Suite"],
      "user": {
        "id": 3,
        "name": "Hajnal"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 10
  }
}
```

### Get a specific boat
**GET** `/boats/:id`

Returns detailed information about a specific boat.

#### Example Request
```bash
curl -X GET "http://localhost:3001/api/v1/boats/1"
```

### Boat Types Available
- `fishing` - Fishing boats
- `yacht` - Luxury yachts
- `sailboat` - Sailboats
- `motorboat` - Motorboats
- `pontoon` - Pontoon boats
- `houseboat` - Houseboats
- `catamaran` - Catamarans
- `speedboat` - Speedboats

### Enhanced Fields
The API now includes these enhanced fields for each boat:
- `boat_type`: Type of boat from predefined categories
- `capacity`: Maximum number of people
- `location`: Location where the boat is available
- `amenities`: JSON array of available amenities
- `images`: JSON array of image URLs
- `rating_average`: Average rating from reviews
- `total_reviews`: Total number of reviews
- `availability_status`: Current availability
- `boat_type_display`: Human-readable boat type
- `capacity_text`: Human-readable capacity
- `location_display`: Formatted location display
- `primary_image`: Main image URL
- `rating_stars`: Star rating display
- `amenities_list`: Parsed amenities array

### Error Handling
All endpoints return appropriate HTTP status codes:
- `200 OK`: Successful request
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server errors

Error responses follow this format:
```json
{
  "status": "error",
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```
